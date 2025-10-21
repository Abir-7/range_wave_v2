import { pgTable, uuid, varchar, jsonb, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../../helper/columns.helpers";

export const MechanicWorkshop = pgTable("mechanic_workshops", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  workshop_name: varchar("workshop_name", { length: 150 }).notNull(),

  start_time: varchar("start_time", { length: 5 }).notNull(), // "HH:mm"
  end_time: varchar("end_time", { length: 5 }).notNull(), // "HH:mm"

  services: jsonb("services").notNull(),
  // ["engine repair", "oil change"]

  location_name: varchar("location_name", { length: 150 }).notNull(),
  place_id: varchar("place_id", { length: 255 }),

  coordinates: numeric("coordinates", { precision: 10, scale: 6 })
    .array()
    .notNull(),
  // Example: [90.4125, 23.8103] => [longitude, latitude]

  experiences: jsonb("experiences"),
  // ["5 years in engine maintenance", "2 years in brake systems"]
  certificates: jsonb("certificates").default([]),
  // [
  //   { institutionName: "ABC Institute", startDate: "10:00", endDate: "14:00",link:"" }
  // ]
  ...timestamps,
});

export const MechanicWorkshopRelations = relations(
  MechanicWorkshop,
  ({ one }) => ({
    profile: one(UserProfiles, {
      fields: [MechanicWorkshop.user_id],
      references: [UserProfiles.id],
    }),
  })
);
