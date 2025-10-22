import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "../../user/user_profiles.schema";
import { timestamps } from "../../../helper/columns.helpers";
import { Bids } from "../bid/bid.schema";
import { ServiceProgress } from "../progress/service_progress.schema";
import { numeric } from "drizzle-orm/pg-core";

// Services table
export const Services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),
  issue: varchar("issue", { length: 255 }).notNull(),
  description: text("description").notNull(),
  scheduled_date: timestamp("scheduled_date"),
  address: text("address"),
  coordinates: numeric("coordinates", { precision: 10, scale: 6 })
    .array()
    .notNull(),
  ...timestamps,
});

export const ServicesRelations = relations(Services, ({ one, many }) => ({
  user: one(UserProfiles, {
    fields: [Services.user_id],
    references: [UserProfiles.user_id],
  }),
  bid_list: many(Bids),
  service_progress: one(ServiceProgress, {
    fields: [Services.id],
    references: [ServiceProgress.service_id],
  }),
}));
