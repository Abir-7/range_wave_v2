import { pgTable, uuid, numeric, text, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Services } from "../service_flow/service/service.schema";
import { UserProfiles } from "../user/user_profiles.schema";
import { Bids } from "../service_flow/bid/bid.schema";
import { timestamps } from "../../helper/columns.helpers";
import { varchar } from "drizzle-orm/pg-core";
import { ServiceProgress } from "../service_flow/progress/service_progress.schema";

export const paymentTypeEnum = pgEnum("payment_type_enum", [
  "ONLINE",
  "OFFLINE",
]);

export const paymentStatusEnum = pgEnum("payment_status_enum", [
  "PAID",
  "UNPAID",
]);

// Payments table
export const Payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tx_id: text("tx_id").notNull().unique(),
  service_progress_id: uuid("service_progress_id")
    .notNull()
    .references(() => ServiceProgress.id),
  status: paymentStatusEnum("status").notNull(),
  payment_type: paymentTypeEnum("payment_type").notNull(),
  total_amount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  ...timestamps,
});

export const PaymentsRelations = relations(Payments, ({ one }) => ({
  service_progress: one(ServiceProgress, {
    fields: [Payments.service_progress_id],
    references: [ServiceProgress.id],
  }),
}));
