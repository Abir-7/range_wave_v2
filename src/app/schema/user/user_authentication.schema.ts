import {
  pgTable,
  uuid,
  text,
  timestamp,
  foreignKey,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Users } from "./user.schema";
import { timestamps } from "../../db/helper/columns.helpers";
import { boolean } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

export const auth_type_enum = pgEnum("auth_type", [
  "email",
  "forgot-password",
  "resend",
  "token",
]);
// user_authentications table
export const UserAuthentications = pgTable("user_authentications", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  otp: varchar("otp", { length: 10 }),
  token: text("token"),
  verification_type: auth_type_enum("type").notNull(),
  expire_time: timestamp("expire_date").notNull(),
  is_success: boolean("is_success").notNull().default(false),
  ...timestamps,
});

export const UserAuthenticationsRelations = relations(
  UserAuthentications,
  ({ one }) => ({
    user: one(Users, {
      fields: [UserAuthentications.user_id],
      references: [Users.id],
    }),
  })
);
