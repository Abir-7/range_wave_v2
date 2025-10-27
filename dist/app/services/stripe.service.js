"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const payment_for_workshop_repository_1 = require("./../repositories/payment_for_workshop.repository");
const stripe_repository_1 = require("../repositories/stripe.repository");
const logger_1 = require("../utils/serverTools/logger");
const appConfig_1 = require("../config/appConfig");
const stripe_1 = require("../config/stripe");
const payment_repository_1 = require("../repositories/payment.repository");
const user_service_progress_repository_1 = require("../repositories/user_service_progress.repository");
const helper_repository_1 = require("../repositories/helper.repository");
const user_repository_1 = require("../repositories/user.repository");
const createPaymentIntentForMechanic = (price_1, mechanic_id_1, ...args_1) => __awaiter(void 0, [price_1, mechanic_id_1, ...args_1], void 0, function* (price, mechanic_id, type = "conflict") {
    let data;
    try {
        if (type === "conflict") {
            // check for previous payment data
            const is_payment_done = yield payment_for_workshop_repository_1.WorkshopPaymentRepository.findWorkshopPaymentByMechanicId(mechanic_id);
            if (is_payment_done && is_payment_done.status === "paid") {
                throw new Error("Payment already done.");
            }
            data = yield stripe_repository_1.StripeRepository.createPaymentIntentForMechanic(price, {
                mechanic_id,
                type: type,
            });
            yield payment_for_workshop_repository_1.WorkshopPaymentRepository.savePaymentForWorkshop(data.id, mechanic_id, price);
            return { client_secret: data.client_secret };
            //return { paymentIntent: data.client_secret };
        }
    }
    catch (error) {
        throw new Error(error);
    }
});
const createPaymentIntentForUser = (payment_data_1, mechanic_account_id_1, ...args_1) => __awaiter(void 0, [payment_data_1, mechanic_account_id_1, ...args_1], void 0, function* (payment_data, mechanic_account_id, currency = "usd") {
    try {
        return yield helper_repository_1.Repository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield stripe_repository_1.StripeRepository.createPaymentIntentForUser(Number(payment_data.total_amount), {
                service_progress_id: payment_data.service_progress_id,
                type: payment_data.type,
                user_id: payment_data.user_id,
            }, currency, mechanic_account_id);
            const saved_data = yield payment_repository_1.PaymentRepository.savePament({
                service_progress_id: payment_data.service_progress_id,
                payment_type: "online",
                status: "unpaid",
                total_amount: payment_data.total_amount,
                tx_id: data.id,
            }, tx);
            return {
                client_secret: data.client_secret,
                payment_id: saved_data.id,
                service_progress_id: payment_data.service_progress_id,
            };
        }));
    }
    catch (error) {
        throw new Error(error);
    }
});
const checkEligibility = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const mechanicData = yield user_repository_1.UserRepository.getMechanicsPaymentData(mechanic_id);
    if (!mechanicData || !mechanicData.account_id) {
        return { eligible: false, reason: "No connected Stripe account" };
    }
    const stripe_data = yield stripe_repository_1.StripeRepository.checkEligibility(mechanicData.account_id);
    if (stripe_data.eligible) {
        yield user_repository_1.UserRepository.updateMechanicPaymentData({ is_active: true }, mechanic_id);
    }
    return stripe_data;
});
const getMechanicStripeDashboardLink = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const mechanicData = yield user_repository_1.UserRepository.getMechanicsPaymentData(mechanic_id);
    if (!mechanicData || !mechanicData.account_id) {
        return { eligible: false, reason: "No connected Stripe account" };
    }
    return yield stripe_repository_1.StripeRepository.getMechanicStripeDashboardLink(mechanicData.account_id);
});
const stripeWebhook = (rawBody, sig) => __awaiter(void 0, void 0, void 0, function* () {
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(rawBody, sig, appConfig_1.appConfig.stripe.webhook);
    }
    catch (err) {
        logger_1.logger.error(`Webhook signature verification failed:${err}`);
        logger_1.logger.error("Webhook signature verification failed.");
        return;
    }
    logger_1.logger.info(event.type);
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const metadata = paymentIntent.metadata;
            if (metadata.type === "conflict") {
                const tx_id = paymentIntent.id;
                const mechanic_id = metadata.mechanic_id;
                yield payment_for_workshop_repository_1.WorkshopPaymentRepository.updatePaymentForWorkshop(tx_id, mechanic_id);
            }
            if (metadata.type === "service_complete") {
                const tx_id = paymentIntent.id;
                const service_progress_id = metadata.service_progress_id;
                yield payment_repository_1.PaymentRepository.updatePamentStatus({
                    tx_id,
                    service_progress_id,
                }, "paid");
                yield user_service_progress_repository_1.ServiceProgressRepository.updateServiceProgress({ service_status: "COMPLETED" }, null, service_progress_id);
            }
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const metadata = paymentIntent.metadata;
            if (metadata.type === "conflict") {
                const tx_id = paymentIntent.id;
                const mechanic_id = metadata.mechanic_id;
                yield payment_for_workshop_repository_1.WorkshopPaymentRepository.deletePaymentForWorkshop(tx_id, mechanic_id);
            }
            if (metadata.type === "service_complete") {
                const tx_id = paymentIntent.id;
                const service_progress_id = metadata.service_progress_id;
                yield payment_repository_1.PaymentRepository.updatePamentStatus({
                    tx_id,
                    service_progress_id,
                }, "failed");
                yield user_service_progress_repository_1.ServiceProgressRepository.updateServiceProgress({ service_status: "NEED_TO_PAY" }, null, service_progress_id);
            }
            break;
        }
        // case "account.updated": {
        //   const account = event.data.object as Stripe.Account;
        //   const payoutsEnabled = account.payouts_enabled;
        //   const chargesEnabled = account.charges_enabled;
        //   const requirements = account.requirements;
        //   if (chargesEnabled && payoutsEnabled) {
        //     logger.info("Account activated.");
        //   }
        //   break;
        // }
        // case "": {
        //   logger.info("Account activated. 2nd");
        // }
    }
});
exports.StripeService = {
    createPaymentIntentForMechanic,
    createPaymentIntentForUser,
    stripeWebhook,
    getMechanicStripeDashboardLink,
    checkEligibility,
};
