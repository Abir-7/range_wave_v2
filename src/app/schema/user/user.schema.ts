import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { user_roles, user_status } from "../../middleware/auth/auth.interface";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { UserAuthentications } from "./user_authentication.schema";
import { timestamps } from "../../db/helper/columns.helpers";

export const user_role = pgEnum("user_role", user_roles);

export const user_status_enum = pgEnum("user_status", user_status);

export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  role: user_role("role").notNull().default("user"),
  password_hash: text("password_hash").notNull(),
  is_verified: boolean("is_verified").notNull().default(false),
  status: user_status_enum("status").notNull().default("pending_verification"),
  need_to_reset_password: boolean("need_to_reset_password")
    .notNull()
    .default(false),
  ...timestamps,
});

export const UsersRelations = relations(Users, ({ one, many }) => ({
  profile: one(UserProfiles, {
    fields: [Users.id],
    references: [UserProfiles.user_id],
  }),

  authentications: many(UserAuthentications),
}));
