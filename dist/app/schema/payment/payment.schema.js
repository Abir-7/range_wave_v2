"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsRelations = exports.Payments = exports.paymentStatusEnum = exports.paymentTypeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
const service_progress_schema_1 = require("../service_flow/progress/service_progress.schema");
const paymentTypeValues = ["online", "offline"];
// PostgreSQL enum
exports.paymentTypeEnum = (0, pg_core_1.pgEnum)("payment_type_enum", paymentTypeValues);
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)("payment_status_enum", [
    "paid",
    "unpaid",
    "failed",
]);
// Payments table
exports.Payments = (0, pg_core_1.pgTable)("payments", Object.assign({ id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(), tx_id: (0, pg_core_1.text)("tx_id"), service_progress_id: (0, pg_core_1.uuid)("service_progress_id")
        .notNull()
        .references(() => service_progress_schema_1.ServiceProgress.id), status: (0, exports.paymentStatusEnum)("status").notNull(), payment_type: (0, exports.paymentTypeEnum)("payment_type").notNull(), total_amount: (0, pg_core_1.numeric)("total_amount", { precision: 12, scale: 2 }).notNull() }, columns_helpers_1.timestamps));
exports.PaymentsRelations = (0, drizzle_orm_1.relations)(exports.Payments, ({ one }) => ({
    service_progress: one(service_progress_schema_1.ServiceProgress, {
        fields: [exports.Payments.service_progress_id],
        references: [service_progress_schema_1.ServiceProgress.id],
    }),
}));
