import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../db/helper/columns.helpers";

export const MechanicPaymentData = pgTable("user_payment_data", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id")
    .unique()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  account_id: varchar("account_id", { length: 255 }),

  is_active: boolean("is_active").notNull().default(false),

  ...timestamps,
});

export const UserPaymentDataRelations = relations(
  MechanicPaymentData,
  ({ one }) => ({
    profile: one(UserProfiles, {
      fields: [MechanicPaymentData.user_id],
      references: [UserProfiles.user_id],
    }),
  })
);
