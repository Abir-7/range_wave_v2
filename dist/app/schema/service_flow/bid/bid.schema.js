"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidsRelations = exports.Bids = exports.bidStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const service_schema_1 = require("../service/service.schema");
const user_profiles_schema_1 = require("../../user/user_profiles.schema");
const columns_helpers_1 = require("../../../db/helper/columns.helpers");
const service_progress_schema_1 = require("../progress/service_progress.schema");
const mechanics_workshop_schema_1 = require("../../user/mechanics_workshop.schema");
// Enum for bid status
exports.bidStatusEnum = (0, pg_core_1.pgEnum)("bid_status", ["provided", "declined"]);
// Bids table
exports.Bids = (0, pg_core_1.pgTable)("bids", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), service_id: (0, pg_core_1.uuid)("service_id")
        .notNull()
        .references(() => service_schema_1.Services.id, { onDelete: "cascade" }), mechanic_id: (0, pg_core_1.uuid)("mechanic_id")
        .notNull()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "set null" }), price: (0, pg_core_1.numeric)("price", { precision: 20, scale: 2 }).notNull(), status: (0, exports.bidStatusEnum)("status").notNull() }, columns_helpers_1.timestamps));
// Relations
exports.BidsRelations = (0, drizzle_orm_1.relations)(exports.Bids, ({ one }) => ({
    service: one(service_schema_1.Services, {
        fields: [exports.Bids.service_id],
        references: [service_schema_1.Services.id],
    }),
    mechanic: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.Bids.mechanic_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    mechanic_workshop: one(mechanics_workshop_schema_1.MechanicWorkshop, {
        fields: [exports.Bids.mechanic_id],
        references: [mechanics_workshop_schema_1.MechanicWorkshop.user_id],
    }),
    service_progress: one(service_progress_schema_1.ServiceProgress, {
        fields: [exports.Bids.id],
        references: [service_progress_schema_1.ServiceProgress.bid_id],
    }),
}));
