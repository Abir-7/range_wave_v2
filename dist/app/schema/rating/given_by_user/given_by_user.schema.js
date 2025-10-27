"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingByUserRelations = exports.RatingByUser = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_profiles_schema_1 = require("../../user/user_profiles.schema");
const columns_helpers_1 = require("../../../db/helper/columns.helpers");
const service_progress_schema_1 = require("../../service_flow/progress/service_progress.schema");
exports.RatingByUser = (0, pg_core_1.pgTable)("rating_by_user", Object.assign({ id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(), rating: (0, pg_core_1.integer)("rating").notNull(), text: (0, pg_core_1.text)("text").notNull(), mechanic_id: (0, pg_core_1.uuid)("mechanic_id")
        .notNull()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "set null" }), user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "set null" }), service_progress_id: (0, pg_core_1.uuid)("service_progress_id")
        .notNull()
        .references(() => service_progress_schema_1.ServiceProgress.id, { onDelete: "cascade" }) }, columns_helpers_1.timestamps));
exports.RatingByUserRelations = (0, drizzle_orm_1.relations)(exports.RatingByUser, ({ one }) => ({
    user: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.RatingByUser.user_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    mechanic: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.RatingByUser.mechanic_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    service: one(service_progress_schema_1.ServiceProgress, {
        fields: [exports.RatingByUser.service_progress_id],
        references: [service_progress_schema_1.ServiceProgress.id],
    }),
}));
