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
exports.StripeRepository = void 0;
const appConfig_1 = require("../config/appConfig");
const stripe_1 = require("../config/stripe");
const AppError_1 = require("../utils/serverTools/AppError");
const user_repository_1 = require("./user.repository");
const toStripeAmount = (usd) => Math.round(usd * 100);
const createPaymentIntentForMechanic = (amountInUsd_1, meta_data_1, ...args_1) => __awaiter(void 0, [amountInUsd_1, meta_data_1, ...args_1], void 0, function* (amountInUsd, meta_data, currency = "usd") {
    const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
        amount: toStripeAmount(amountInUsd),
        currency,
        metadata: meta_data,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return paymentIntent;
});
// const createPaymentIntentForUser = async (
//   amountInUsd: number,
//   meta_data: {
//     type: "service_complete" | "other";
//     user_id: string;
//     service_progress_id: string;
//   },
//   currency: string = "usd",
//   mechanic_account_id: string
// ) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: toStripeAmount(amountInUsd),
//     currency,
//     metadata: meta_data,
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });
//   return paymentIntent;
// };
const createPaymentIntentForUser = (amountInUsd_1, meta_data_1, ...args_1) => __awaiter(void 0, [amountInUsd_1, meta_data_1, ...args_1], void 0, function* (amountInUsd, meta_data, currency = "usd", mechanic_account_id // Connected Account ID like acct_xxx
) {
    const paymentIntent = yield stripe_1.stripe.paymentIntents.create({
        amount: toStripeAmount(amountInUsd),
        currency,
        metadata: meta_data,
        transfer_data: {
            destination: mechanic_account_id,
        },
        on_behalf_of: mechanic_account_id,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return paymentIntent;
});
const createStripeConnectAccountLink = (mechanicUserId, mechanicEmail) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mechanicPaymentInfo = yield user_repository_1.UserRepository.getMechanicsPaymentData(mechanicUserId);
    if (!mechanicPaymentInfo) {
        throw new AppError_1.AppError("Mechanic not found.", 404);
    }
    const accountId = (_a = mechanicPaymentInfo.account_id) !== null && _a !== void 0 ? _a : (yield stripe_1.stripe.accounts.create({
        type: "express",
        email: mechanicEmail,
        metadata: { mechanic_user_id: mechanicUserId },
    })).id;
    if (!mechanicPaymentInfo.account_id) {
        yield user_repository_1.UserRepository.updateMechanicPaymentData({ account_id: accountId }, mechanicUserId);
    }
    // 3) Create onboarding link
    const accountLink = yield stripe_1.stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${appConfig_1.appConfig.server.base_url}/stripe/onboarding/refresh`,
        return_url: `${appConfig_1.appConfig.server.base_url}/stripe/onboarding/success`,
        type: "account_onboarding",
    });
    return {
        account_id: accountId,
        onboarding_url: accountLink.url,
    };
});
const checkEligibility = (account_id) => __awaiter(void 0, void 0, void 0, function* () {
    // 2) Retrieve the Stripe account
    const stripeAccount = yield stripe_1.stripe.accounts.retrieve(account_id);
    // 3) Check eligibility
    if (!stripeAccount.charges_enabled || !stripeAccount.payouts_enabled) {
        return {
            eligible: false,
            reason: "Stripe account not fully enabled",
            charges_enabled: stripeAccount.charges_enabled,
            payouts_enabled: stripeAccount.payouts_enabled,
            account: stripeAccount.id,
        };
    }
    // 4) Mechanic is eligible
    return {
        eligible: true,
        reason: null,
        charges_enabled: stripeAccount.charges_enabled,
        payouts_enabled: stripeAccount.payouts_enabled,
        account: stripeAccount.id,
    };
});
const getMechanicStripeDashboardLink = (account_id) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Retrieve the connected account
    const account = (yield stripe_1.stripe.accounts.retrieve(account_id));
    if (!account) {
        throw new Error("Stripe account not found");
    }
    // 2) Create login link to Express dashboard
    const loginLink = yield stripe_1.stripe.accounts.createLoginLink(account_id, {});
    return loginLink.url;
});
exports.StripeRepository = {
    createPaymentIntentForMechanic,
    createPaymentIntentForUser,
    createStripeConnectAccountLink,
    checkEligibility,
    getMechanicStripeDashboardLink,
};
