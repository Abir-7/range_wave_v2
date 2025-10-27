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
exports.WorkshopPaymentRepository = void 0;
const payment_for_workshop_1 = require("../schema/payment/payment_for_workshop");
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const savePaymentForWorkshop = (intentId, mechanic_id, price) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db.insert(payment_for_workshop_1.Payments_for_workshop).values({
        tx_id: intentId, // stripe paymentIntent id
        mechanic_id,
        total_amount: price.toString(), // store in normal units ($9)
        status: "unpaid", // initial status
    });
});
const updatePaymentForWorkshop = (tx_id, mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.db
        .update(payment_for_workshop_1.Payments_for_workshop)
        .set({ status: "paid", updated_at: new Date() })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payment_for_workshop_1.Payments_for_workshop.tx_id, tx_id), (0, drizzle_orm_1.eq)(payment_for_workshop_1.Payments_for_workshop.mechanic_id, mechanic_id)));
});
const deletePaymentForWorkshop = (tx_id, mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.db
        .delete(payment_for_workshop_1.Payments_for_workshop)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(payment_for_workshop_1.Payments_for_workshop.tx_id, tx_id), (0, drizzle_orm_1.eq)(payment_for_workshop_1.Payments_for_workshop.mechanic_id, mechanic_id)));
});
const findWorkshopPaymentByMechanicId = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db.query.Payments_for_workshop.findFirst({
        where: (0, drizzle_orm_1.eq)(payment_for_workshop_1.Payments_for_workshop.mechanic_id, mechanic_id),
    });
    return data;
});
exports.WorkshopPaymentRepository = {
    savePaymentForWorkshop,
    updatePaymentForWorkshop,
    deletePaymentForWorkshop,
    findWorkshopPaymentByMechanicId,
};
