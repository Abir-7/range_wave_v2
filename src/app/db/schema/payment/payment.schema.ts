import { pgTable, uuid, numeric, text, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Services } from "../service_flow/service/service.schema";
import { UserProfiles } from "../user/user_profiles.schema";
import { Bids } from "../service_flow/bid/bid.schema";
import { timestamps } from "../../helper/columns.helpers";

// Enums
export const paymentTypeEnum = pgEnum("payment_type_enum", [
  "ONLINE",
  "OFFLINE",
]);

export const paymentStatusEnum = pgEnum("payment_status_enum", [
  "CANCELLED",
  "PAID",
  "UNPAID",
  "REFUNDED",
]);

// Payments table
export const Payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  tx_id: text("tx_id").notNull().unique(),

  bid_id: uuid("bid_id")
    .notNull()
    .references(() => Bids.id),

  service_id: uuid("service_id")
    .notNull()
    .references(() => Services.id, { onDelete: "cascade" }),

  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id),

  mechanic_id: uuid("mechanic_id")
    .notNull()
    .references(() => UserProfiles.user_id),

  status: paymentStatusEnum("status").notNull(),

  payment_type: paymentTypeEnum("payment_type").notNull(),

  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  extra_amount: numeric("extra_amount", { precision: 12, scale: 2 }).notNull(),

  ...timestamps,
});

export const PaymentsRelations = relations(Payments, ({ one }) => ({
  // Payment belongs to one user
  user: one(UserProfiles, {
    fields: [Payments.user_id],
    references: [UserProfiles.user_id],
  }),

  // Payment belongs to one mechanic
  mechanic: one(UserProfiles, {
    fields: [Payments.mechanic_id],
    references: [UserProfiles.user_id],
  }),

  // Payment belongs to one service
  service: one(Services, {
    fields: [Payments.service_id],
    references: [Services.id],
  }),

  // Payment belongs to one bid
  bid: one(Bids, {
    fields: [Payments.bid_id],
    references: [Bids.id],
  }),
}));
