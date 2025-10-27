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
exports.ServiceProgressService = void 0;
const chat_repository_1 = require("../repositories/chat.repository");
const helper_repository_1 = require("../repositories/helper.repository");
const payment_repository_1 = require("../repositories/payment.repository");
const user_repository_1 = require("../repositories/user.repository");
const user_service_progress_repository_1 = require("../repositories/user_service_progress.repository");
const AppError_1 = require("../utils/serverTools/AppError");
const stripe_service_1 = require("./stripe.service");
const hireMechanic = (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const service_progress_data = yield user_service_progress_repository_1.ServiceProgressRepository.findServiceProgressData(data.service_id, null);
    if (service_progress_data &&
        ((service_progress_data === null || service_progress_data === void 0 ? void 0 : service_progress_data.bid_id) || service_progress_data.mechanic_id)) {
        return service_progress_data;
    }
    const { bid_id, mechanic_id, service_id } = data;
    return yield helper_repository_1.Repository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield chat_repository_1.ChatRepository.makeNewChatRoom({
            mechanic_id: data.mechanic_id,
            user_id,
        }, tx);
        const updated_data = yield user_service_progress_repository_1.ServiceProgressRepository.updateServiceProgress({
            bid_id,
            mechanic_id,
            service_status: "ON_THE_WAY",
            updated_at: new Date(),
        }, service_id, null, tx);
        return updated_data;
    }));
});
const markAsComplete = (s_id, mode) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const service_progress_data = yield user_service_progress_repository_1.ServiceProgressRepository.findServiceProgressData(s_id, null);
    if (!service_progress_data) {
        throw new AppError_1.AppError("Service data not found.", 404);
    }
    const saved_payment = yield payment_repository_1.PaymentRepository.getPaymentByServiceProgresId(service_progress_data.id);
    if (saved_payment && saved_payment.status === "paid") {
        throw new AppError_1.AppError("Already paid for this service", 400);
    }
    const total_amount = (service_progress_data.extra_work_accept_status === "accepted"
        ? Number(service_progress_data.extra_price)
        : 0) + Number((_b = (_a = service_progress_data.bid_data) === null || _a === void 0 ? void 0 : _a.price) !== null && _b !== void 0 ? _b : 0);
    if (mode === "offline") {
        const payment_data = {
            tx_id: `tx-${new Date()}`,
            service_progress_id: service_progress_data.id,
            payment_type: mode,
            total_amount: total_amount.toString(),
        };
        return yield helper_repository_1.Repository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const saved_payment = yield payment_repository_1.PaymentRepository.savePament(Object.assign(Object.assign({}, payment_data), { status: "paid" }), tx);
            yield user_service_progress_repository_1.ServiceProgressRepository.updateServiceProgress({ service_status: "COMPLETED" }, s_id, null);
            return {
                payment_id: saved_payment.id,
                client_secret: null,
                service_progress_id: payment_data.service_progress_id,
            };
        }));
    }
    if (mode === "online") {
        const mechanic_id = (_c = service_progress_data === null || service_progress_data === void 0 ? void 0 : service_progress_data.bid_data) === null || _c === void 0 ? void 0 : _c.mechanic_id;
        if (!mechanic_id) {
            throw new AppError_1.AppError("Mechanic data not found.");
        }
        const mechanic_payment_info = yield user_repository_1.UserRepository.getMechanicsPaymentData(mechanic_id);
        if (!mechanic_payment_info || !mechanic_payment_info.account_id) {
            throw new AppError_1.AppError("Mechanic Account id not found.", 400);
        }
        const data = yield stripe_service_1.StripeService.createPaymentIntentForUser({
            payment_type: "online",
            service_progress_id: service_progress_data.id,
            total_amount: String(total_amount),
            type: "service_complete",
            user_id: service_progress_data.user_id,
        }, mechanic_payment_info.account_id
        //  if need then add  curency here
        );
        // return { paymentIntent: data.client_secret };
        return data;
    }
});
const getAllRunningServiceProgress = (id, role, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "mechanic") {
        return yield user_service_progress_repository_1.ServiceProgressRepository.getMechanicsAllRunningServiceProgress(status, id);
    }
    if (role === "user") {
        return yield user_service_progress_repository_1.ServiceProgressRepository.getUsersAllRunningServiceProgress(status, id);
    }
    return [];
});
const acceptOrRejectExtraWork = (status, service_id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_service_progress_repository_1.ServiceProgressRepository.updateServiceProgress({ extra_work_accept_status: status }, service_id, null);
});
// mechanic
const addExtraWorkData = (data, service_id) => __awaiter(void 0, void 0, void 0, function* () {
    const updated_data = yield user_service_progress_repository_1.ServiceProgressRepository.updateServiceProgress(Object.assign(Object.assign({}, data), { extra_work_accept_status: "pending" }), service_id, null);
    return updated_data;
});
const changeServiceStatus = (s_id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield user_service_progress_repository_1.ServiceProgressRepository.updateServiceProgress({ service_status: status }, s_id, null);
    return {
        service_progress_id: data.id,
        service_id: data.service_id,
        status: data.service_status,
    };
});
exports.ServiceProgressService = {
    hireMechanic,
    changeServiceStatus,
    markAsComplete,
    getAllRunningServiceProgress,
    addExtraWorkData,
    acceptOrRejectExtraWork,
};
