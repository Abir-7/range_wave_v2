"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRelations = exports.Users = exports.user_status_enum = exports.user_role = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const auth_interface_1 = require("../../middleware/auth/auth.interface");
const drizzle_orm_1 = require("drizzle-orm");
const user_profiles_schema_1 = require("./user_profiles.schema");
const user_authentication_schema_1 = require("./user_authentication.schema");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
exports.user_role = (0, pg_core_1.pgEnum)("user_role", auth_interface_1.user_roles);
exports.user_status_enum = (0, pg_core_1.pgEnum)("user_status", auth_interface_1.user_status);
exports.Users = (0, pg_core_1.pgTable)("users", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), email: (0, pg_core_1.varchar)("email", { length: 320 }).notNull().unique(), role: (0, exports.user_role)("role").notNull().default("user"), password_hash: (0, pg_core_1.text)("password_hash").notNull(), is_verified: (0, pg_core_1.boolean)("is_verified").notNull().default(false), status: (0, exports.user_status_enum)("status").notNull().default("pending_verification"), need_to_reset_password: (0, pg_core_1.boolean)("need_to_reset_password")
        .notNull()
        .default(false) }, columns_helpers_1.timestamps));
exports.UsersRelations = (0, drizzle_orm_1.relations)(exports.Users, ({ one, many }) => ({
    profile: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.Users.id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    authentications: many(user_authentication_schema_1.UserAuthentications),
}));
