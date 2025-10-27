"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicWorkshopRelations = exports.MechanicWorkshop = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_profiles_schema_1 = require("./user_profiles.schema");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
exports.MechanicWorkshop = (0, pg_core_1.pgTable)("mechanic_workshops", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .unique()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "cascade" }), workshop_name: (0, pg_core_1.varchar)("workshop_name", { length: 150 }), start_time: (0, pg_core_1.varchar)("start_time", { length: 5 }), end_time: (0, pg_core_1.varchar)("end_time", { length: 5 }), services: (0, pg_core_1.jsonb)("services"), location_name: (0, pg_core_1.varchar)("location_name", { length: 150 }), place_id: (0, pg_core_1.varchar)("place_id", { length: 255 }), coordinates: (0, pg_core_1.numeric)("coordinates", { precision: 10, scale: 6 }).array(), experiences: (0, pg_core_1.jsonb)("experiences"), certificates: (0, pg_core_1.jsonb)("certificates").default([]), is_conflict: (0, pg_core_1.boolean)("is_conflict").default(false) }, columns_helpers_1.timestamps));
exports.MechanicWorkshopRelations = (0, drizzle_orm_1.relations)(exports.MechanicWorkshop, ({ one }) => ({
    profile: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.MechanicWorkshop.user_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
}));
