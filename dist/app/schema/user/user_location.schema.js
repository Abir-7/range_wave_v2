"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLocationsRelations = exports.UserLocations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_profiles_schema_1 = require("./user_profiles.schema");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
exports.UserLocations = (0, pg_core_1.pgTable)("user_locations", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id").references(() => user_profiles_schema_1.UserProfiles.user_id, {
        onDelete: "cascade",
    }), apartment_no: (0, pg_core_1.varchar)("apartment_no", { length: 50 }), road_no: (0, pg_core_1.varchar)("road_no", { length: 50 }), state: (0, pg_core_1.varchar)("state", { length: 100 }), city: (0, pg_core_1.varchar)("city", { length: 100 }), zip_code: (0, pg_core_1.varchar)("zip_code", { length: 20 }), address: (0, pg_core_1.text)("address"), country: (0, pg_core_1.varchar)("country", { length: 100 }) }, columns_helpers_1.timestamps));
exports.UserLocationsRelations = (0, drizzle_orm_1.relations)(exports.UserLocations, ({ one }) => ({
    profile: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.UserLocations.user_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
}));
