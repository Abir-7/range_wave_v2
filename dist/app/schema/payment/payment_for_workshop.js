"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payments_for_workshop = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
const mechanics_workshop_schema_1 = require("../user/mechanics_workshop.schema");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
const pg_core_3 = require("drizzle-orm/pg-core");
const payment_schema_1 = require("./payment.schema");
exports.Payments_for_workshop = (0, pg_core_2.pgTable)("payments_for_workshop", Object.assign({ id: (0, pg_core_2.uuid)("id").defaultRandom().primaryKey(), tx_id: (0, pg_core_1.text)("tx_id").unique(), mechanic_id: (0, pg_core_2.uuid)("mechanic_id")
        .notNull()
        .unique()
        .references(() => mechanics_workshop_schema_1.MechanicWorkshop.user_id, { onDelete: "cascade" }), total_amount: (0, pg_core_3.numeric)("total_amount", { precision: 12, scale: 2 }).notNull(), status: (0, payment_schema_1.paymentStatusEnum)("status").notNull() }, columns_helpers_1.timestamps));
