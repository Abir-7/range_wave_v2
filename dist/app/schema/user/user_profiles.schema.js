"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfilesRelations = exports.UserProfiles = exports.genderEnum = exports.genders = void 0;
const mechanic_payment_data_schema_1 = require("./mechanic_payment_data.schema");
const pg_core_1 = require("drizzle-orm/pg-core");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
const user_schema_1 = require("./user.schema");
const drizzle_orm_1 = require("drizzle-orm");
const service_schema_1 = require("../service_flow/service/service.schema");
const user_carinfo_schema_1 = require("./user_carinfo.schema");
const mechanics_workshop_schema_1 = require("./mechanics_workshop.schema");
const user_location_schema_1 = require("./user_location.schema");
const pg_core_2 = require("drizzle-orm/pg-core");
const given_by_user_schema_1 = require("../rating/given_by_user/given_by_user.schema");
const given_by_mechanic_schema_1 = require("../rating/given_by_mechanic/given_by_mechanic.schema");
// Optional: Gender enum
exports.genders = ["male", "female", "other"];
exports.genderEnum = (0, pg_core_1.pgEnum)("gender_enum", exports.genders);
// UserProfiles table
exports.UserProfiles = (0, pg_core_1.pgTable)("user_profiles", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), 
    // FK to users table, must exist
    user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .unique()
        .references(() => user_schema_1.Users.id, { onDelete: "cascade" }), full_name: (0, pg_core_1.varchar)("full_name", { length: 100 }).notNull(), 
    // Optional fields
    user_name: (0, pg_core_1.varchar)("user_name", { length: 50 }).unique(), mobile: (0, pg_core_1.varchar)("mobile", { length: 20 }).unique(), address: (0, pg_core_1.text)("address"), gender: (0, exports.genderEnum)("gender"), image: (0, pg_core_1.text)("image"), image_id: (0, pg_core_1.text)("image_id"), is_profile_completed: (0, pg_core_2.boolean)("is_profile_completed")
        .notNull()
        .default(false) }, columns_helpers_1.timestamps));
exports.UserProfilesRelations = (0, drizzle_orm_1.relations)(exports.UserProfiles, ({ one, many }) => ({
    user: one(user_schema_1.Users),
    services: many(service_schema_1.Services),
    car_info: one(user_carinfo_schema_1.UserCars),
    work_shop: one(mechanics_workshop_schema_1.MechanicWorkshop, {
        fields: [exports.UserProfiles.user_id],
        references: [mechanics_workshop_schema_1.MechanicWorkshop.user_id],
    }),
    location: one(user_location_schema_1.UserLocations),
    payment_info: one(mechanic_payment_data_schema_1.MechanicPaymentData, {
        fields: [exports.UserProfiles.user_id],
        references: [mechanic_payment_data_schema_1.MechanicPaymentData.user_id],
    }),
    rating_by_user: many(given_by_user_schema_1.RatingByUser),
    rating_by_mechanic: many(given_by_mechanic_schema_1.RatingByMechanic),
}));
