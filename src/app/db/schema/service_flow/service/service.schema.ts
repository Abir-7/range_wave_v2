import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "../../user/user_profiles.schema";
import { timestamps } from "../../../helper/columns.helpers";

// Enums
export const serviceStatusEnum = pgEnum("service_status", [
  "FINDING",
  "WAITING",
  "WORKING",
  "COMPLETED",
  "CANCELLED",
]);

export const serviceCompletedEnum = pgEnum("service_completed", ["YES", "NO"]);

export const cancelReasonEnum = pgEnum("cancel_reason", [
  "Wait time is too long",
  "Could not find mechanic",
  "Mechanic not getting closer",
  "Mechanic asked me to cancel",
  "Other",
]);

// Services table
export const Services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  issue: varchar("issue", { length: 255 }).notNull(),
  description: text("description").notNull(),

  status: serviceStatusEnum("status").notNull().default("FINDING"),
  cancel_reason: cancelReasonEnum("cancel_reason"),

  is_scheduled: boolean("is_scheduled").notNull().default(false),
  scheduled_date: timestamp("scheduled_date"),
  ...timestamps,
});

export const ServicesRelations = relations(Services, ({ one }) => ({
  user: one(UserProfiles, {
    fields: [Services.user_id],
    references: [UserProfiles.user_id],
  }),
}));
