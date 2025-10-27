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
exports.PaymentRepository = void 0;
const bid_schema_1 = require("./../schema/service_flow/bid/bid.schema");
const drizzle_orm_1 = require("drizzle-orm");
const payment_schema_1 = require("../schema/payment/payment.schema");
const db_1 = require("../db");
const service_progress_schema_1 = require("../schema/service_flow/progress/service_progress.schema");
const savePament = (data, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const [saved_payment] = yield client
        .insert(payment_schema_1.Payments)
        .values(data)
        .returning();
    return saved_payment;
});
const updatePamentStatus = (data, status, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const updated_data = yield client
        .update(payment_schema_1.Payments)
        .set({ status: status, updated_at: new Date() })
        .where((0, drizzle_orm_1.and)(((0, drizzle_orm_1.eq)(payment_schema_1.Payments.service_progress_id, data.service_progress_id),
        (0, drizzle_orm_1.eq)(payment_schema_1.Payments.tx_id, data.tx_id))));
    return updated_data;
});
const getPaymentByServiceProgresId = (sp_id) => __awaiter(void 0, void 0, void 0, function* () {
    const saved_payment = yield db_1.db.query.Payments.findFirst({
        where: (0, drizzle_orm_1.eq)(payment_schema_1.Payments.service_progress_id, sp_id),
    });
    return saved_payment;
});
const getMechanicsEarningData = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db
        .select({
        payment: payment_schema_1.Payments,
        service_progress: service_progress_schema_1.ServiceProgress,
        bid_data: bid_schema_1.Bids,
    })
        .from(payment_schema_1.Payments)
        .leftJoin(service_progress_schema_1.ServiceProgress, (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.id, payment_schema_1.Payments.service_progress_id))
        .leftJoin(bid_schema_1.Bids, (0, drizzle_orm_1.eq)(bid_schema_1.Bids.service_id, service_progress_schema_1.ServiceProgress.service_id))
        .where((0, drizzle_orm_1.eq)(bid_schema_1.Bids.mechanic_id, mechanic_id));
    return data;
});
exports.PaymentRepository = {
    savePament,
    getPaymentByServiceProgresId,
    updatePamentStatus,
    getMechanicsEarningData,
};
