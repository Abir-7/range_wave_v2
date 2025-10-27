"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthenticationsRelations = exports.UserAuthentications = exports.auth_type_enum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_schema_1 = require("./user.schema");
const columns_helpers_1 = require("../../db/helper/columns.helpers");
const pg_core_2 = require("drizzle-orm/pg-core");
const pg_core_3 = require("drizzle-orm/pg-core");
exports.auth_type_enum = (0, pg_core_3.pgEnum)("auth_type", [
    "email",
    "forgot-password",
    "resend",
    "token",
]);
// user_authentications table
exports.UserAuthentications = (0, pg_core_1.pgTable)("user_authentications", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => user_schema_1.Users.id, { onDelete: "cascade" }), otp: (0, pg_core_1.varchar)("otp", { length: 10 }), token: (0, pg_core_1.text)("token"), verification_type: (0, exports.auth_type_enum)("type").notNull(), expire_time: (0, pg_core_1.timestamp)("expire_date").notNull(), is_success: (0, pg_core_2.boolean)("is_success").notNull().default(false) }, columns_helpers_1.timestamps));
exports.UserAuthenticationsRelations = (0, drizzle_orm_1.relations)(exports.UserAuthentications, ({ one }) => ({
    user: one(user_schema_1.Users, {
        fields: [exports.UserAuthentications.user_id],
        references: [user_schema_1.Users.id],
    }),
}));
