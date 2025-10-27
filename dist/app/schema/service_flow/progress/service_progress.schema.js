"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProgressRelation = exports.ServiceProgress = exports.serviceStatusEnum = exports.extraWorkAcceptStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
const bid_schema_1 = require("../bid/bid.schema");
const service_schema_1 = require("../service/service.schema");
const user_profiles_schema_1 = require("../../user/user_profiles.schema");
const pg_core_3 = require("drizzle-orm/pg-core");
const pg_core_4 = require("drizzle-orm/pg-core");
const columns_helpers_1 = require("../../../db/helper/columns.helpers");
const pg_core_5 = require("drizzle-orm/pg-core");
const pg_core_6 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const payment_schema_1 = require("../../payment/payment.schema");
const room_schema_1 = require("../../chat/room/room.schema");
const extraWorkAcceptValues = ["accepted", "rejected", "pending"];
exports.extraWorkAcceptStatusEnum = (0, pg_core_6.pgEnum)("extra_work_accept_enum", extraWorkAcceptValues);
const serviceStatusValues = [
    "FINDING",
    "ON_THE_WAY",
    "WORKING",
    "NEED_TO_PAY",
    "COMPLETED",
    "CANCELLED",
];
// Create the PostgreSQL enum
exports.serviceStatusEnum = (0, pg_core_6.pgEnum)("service_status", serviceStatusValues);
exports.ServiceProgress = (0, pg_core_2.pgTable)("service_progress", Object.assign({ id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(), bid_id: (0, pg_core_1.uuid)("bid_id").references(() => bid_schema_1.Bids.id, { onDelete: "set null" }), service_id: (0, pg_core_1.uuid)("service_id")
        .unique()
        .references(() => service_schema_1.Services.id, {
        onDelete: "cascade",
    }), chat_id: (0, pg_core_1.uuid)("chat_id").references(() => room_schema_1.ChatRooms.id, {
        onDelete: "cascade",
    }), user_id: (0, pg_core_1.uuid)("user_id").references(() => user_profiles_schema_1.UserProfiles.user_id, {
        onDelete: "set null",
    }), mechanic_id: (0, pg_core_1.uuid)("mechanic_id").references(() => user_profiles_schema_1.UserProfiles.user_id, {
        onDelete: "set null",
    }), extra_issue: (0, pg_core_4.varchar)("extra_issue"), extra_issue_description: (0, pg_core_4.varchar)("extra_issue_desc"), extra_price: (0, pg_core_3.numeric)("extra_price", { precision: 12, scale: 2 }).default("0"), service_status: (0, exports.serviceStatusEnum)("status").notNull().default("FINDING"), is_scheduled: (0, pg_core_5.boolean)("is_scheduled").notNull().default(false), extra_work_accept_status: (0, exports.extraWorkAcceptStatusEnum)("extra_work_accept_status"), cancel_reason: (0, pg_core_4.varchar)("cancel_reason", { length: 5255 }) }, columns_helpers_1.timestamps));
exports.ServiceProgressRelation = (0, drizzle_orm_1.relations)(exports.ServiceProgress, ({ one }) => ({
    bid_data: one(bid_schema_1.Bids, {
        fields: [exports.ServiceProgress.bid_id],
        references: [bid_schema_1.Bids.id],
    }),
    payment: one(payment_schema_1.Payments, {
        fields: [exports.ServiceProgress.id],
        references: [payment_schema_1.Payments.service_progress_id],
    }),
    service_data: one(service_schema_1.Services, {
        fields: [exports.ServiceProgress.service_id],
        references: [service_schema_1.Services.id],
    }),
    mechanic: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.ServiceProgress.mechanic_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    user: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.ServiceProgress.user_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
}));
