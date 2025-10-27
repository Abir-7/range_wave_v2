"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPaymentDataRelations = exports.MechanicPaymentData = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
const user_profiles_schema_1 = require("./user_profiles.schema");
exports.MechanicPaymentData = (0, pg_core_1.pgTable)("user_payment_data", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id")
        .unique()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "cascade" }), account_id: (0, pg_core_1.varchar)("account_id", { length: 255 }), is_active: (0, pg_core_1.boolean)("is_active").notNull().default(false) }, columns_helpers_1.timestamps));
exports.UserPaymentDataRelations = (0, drizzle_orm_1.relations)(exports.MechanicPaymentData, ({ one }) => ({
    profile: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.MechanicPaymentData.user_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
}));
