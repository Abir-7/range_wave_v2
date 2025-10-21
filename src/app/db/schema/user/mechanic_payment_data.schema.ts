import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "../../helper/columns.helpers";
import { UserProfiles } from "./user_profiles.schema";

export const MechanicPaymentData = pgTable("user_payment_data", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_profile_id: uuid("user_profile_id")
    .notNull()
    .references(() => UserProfiles.id, { onDelete: "cascade" }),

  account_id: varchar("account_id", { length: 255 }).notNull(),

  is_active: boolean("is_active").notNull().default(false),

  ...timestamps,
});

export const UserPaymentDataRelations = relations(
  MechanicPaymentData,
  ({ one }) => ({
    profile: one(UserProfiles, {
      fields: [MechanicPaymentData.user_profile_id],
      references: [UserProfiles.id],
    }),
  })
);
