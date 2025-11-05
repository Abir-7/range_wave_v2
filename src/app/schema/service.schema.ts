import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { timestamps } from "../db/helper/columns.helpers";
import { Bids } from "./bid.schema";

import { numeric } from "drizzle-orm/pg-core";
import { UserProfiles } from "./user_profiles.schema";
import { ServiceProgress } from "./service_progress.schema";
import { UserCars } from "./user_carinfo.schema";

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
  car_id: uuid("car_id").notNull(),
  //.references(() => UserCars.id, { onDelete: "set null" }),
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
  car_info: one(UserCars, {
    fields: [Services.car_id],
    references: [UserCars.id],
  }),
}));
