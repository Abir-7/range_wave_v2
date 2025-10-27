"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRelations = exports.Services = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_profiles_schema_1 = require("../../user/user_profiles.schema");
const columns_helpers_1 = require("../../../db/helper/columns.helpers");
const bid_schema_1 = require("../bid/bid.schema");
const service_progress_schema_1 = require("../progress/service_progress.schema");
const pg_core_2 = require("drizzle-orm/pg-core");
// Services table
exports.Services = (0, pg_core_1.pgTable)("services", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "cascade" }), issue: (0, pg_core_1.varchar)("issue", { length: 255 }).notNull(), description: (0, pg_core_1.text)("description").notNull(), scheduled_date: (0, pg_core_1.timestamp)("scheduled_date"), address: (0, pg_core_1.text)("address"), coordinates: (0, pg_core_2.numeric)("coordinates", { precision: 10, scale: 6 })
        .array()
        .notNull() }, columns_helpers_1.timestamps));
exports.ServicesRelations = (0, drizzle_orm_1.relations)(exports.Services, ({ one, many }) => ({
    user: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.Services.user_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    bid_list: many(bid_schema_1.Bids),
    service_progress: one(service_progress_schema_1.ServiceProgress, {
        fields: [exports.Services.id],
        references: [service_progress_schema_1.ServiceProgress.service_id],
    }),
}));
