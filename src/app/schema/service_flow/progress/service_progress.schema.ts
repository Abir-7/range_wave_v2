import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Bids } from "../bid/bid.schema";
import { Services } from "../service/service.schema";
import { UserProfiles } from "../../user/user_profiles.schema";
import { numeric } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../../../db/helper/columns.helpers";
import { boolean } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Payments } from "../../payment/payment.schema";
import { ChatRooms } from "../../chat/room/room.schema";

const extraWorkAcceptValues = ["accepted", "rejected", "pending"] as const;

export const extraWorkAcceptStatusEnum = pgEnum(
  "extra_work_accept_enum",
  extraWorkAcceptValues
);

const serviceStatusValues = [
  "FINDING",
  "ON_THE_WAY",
  "WORKING",
  "NEED_TO_PAY",
  "COMPLETED",
  "CANCELLED",
] as const;

// Create the PostgreSQL enum
export const serviceStatusEnum = pgEnum("service_status", serviceStatusValues);

// TypeScript type from values
export type TServiceStatus = (typeof serviceStatusValues)[number];
export type TExtraWorkAcceptStatus = (typeof extraWorkAcceptValues)[number];
export const ServiceProgress = pgTable("service_progress", {
  id: uuid("id").defaultRandom().primaryKey(),

  bid_id: uuid("bid_id").references(() => Bids.id, { onDelete: "set null" }),

  service_id: uuid("service_id")
    .unique()
    .references(() => Services.id, {
      onDelete: "cascade",
    }),
  chat_id: uuid("chat_id").references(() => ChatRooms.id, {
    onDelete: "cascade",
  }),
  user_id: uuid("user_id").references(() => UserProfiles.user_id, {
    onDelete: "set null",
  }),

  mechanic_id: uuid("mechanic_id").references(() => UserProfiles.user_id, {
    onDelete: "set null",
  }),
  extra_issue: varchar("extra_issue"),
  extra_issue_description: varchar("extra_issue_desc"),
  extra_price: numeric("extra_price", { precision: 12, scale: 2 }).default("0"),

  service_status: serviceStatusEnum("status").notNull().default("FINDING"),

  is_scheduled: boolean("is_scheduled").notNull().default(false),

  extra_work_accept_status: extraWorkAcceptStatusEnum(
    "extra_work_accept_status"
  ),
  cancel_reason: varchar("cancel_reason", { length: 5255 }),
  ...timestamps,
});

export const ServiceProgressRelation = relations(
  ServiceProgress,
  ({ one }) => ({
    bid_data: one(Bids, {
      fields: [ServiceProgress.bid_id],
      references: [Bids.id],
    }),
    payment: one(Payments, {
      fields: [ServiceProgress.id],
      references: [Payments.service_progress_id],
    }),
    service_data: one(Services, {
      fields: [ServiceProgress.service_id],
      references: [Services.id],
    }),
    mechanic: one(UserProfiles, {
      fields: [ServiceProgress.mechanic_id],
      references: [UserProfiles.user_id],
    }),
    user: one(UserProfiles, {
      fields: [ServiceProgress.user_id],
      references: [UserProfiles.user_id],
    }),
  })
);
