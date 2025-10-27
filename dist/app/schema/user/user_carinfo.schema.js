"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCarsRelations = exports.UserCars = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_profiles_schema_1 = require("./user_profiles.schema");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
exports.UserCars = (0, pg_core_1.pgTable)("user_cars", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id").references(() => user_profiles_schema_1.UserProfiles.user_id, {
        onDelete: "cascade",
    }), car_name: (0, pg_core_1.varchar)("car_name", { length: 100 }), car_model: (0, pg_core_1.varchar)("car_model", { length: 100 }), vin_code: (0, pg_core_1.varchar)("vin_code", { length: 100 }), license_plate: (0, pg_core_1.varchar)("license_plate", { length: 50 }), tag_number: (0, pg_core_1.varchar)("tag_number", { length: 50 }) }, columns_helpers_1.timestamps));
exports.UserCarsRelations = (0, drizzle_orm_1.relations)(exports.UserCars, ({ one }) => ({
    profile: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.UserCars.user_id],
        references: [user_profiles_schema_1.UserProfiles.id],
    }),
}));
