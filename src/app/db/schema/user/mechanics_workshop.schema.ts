import { pgTable, uuid, varchar, jsonb, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../../helper/columns.helpers";

export const MechanicWorkshop = pgTable("mechanic_workshops", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_profile_id: uuid("user_profile_id")
    .notNull()
    .references(() => UserProfiles.id, { onDelete: "cascade" }),

  workshop_name: varchar("workshop_name", { length: 150 }).notNull(),

  working_hours: jsonb("working_hours").notNull(),
  // { start: "10:00", end: "15:00" }

  services: jsonb("services").notNull(),
  // ["engine repair", "oil change"]

  location_name: varchar("location_name", { length: 150 }).notNull(),
  place_id: varchar("place_id", { length: 255 }).notNull(),

  coordinates: numeric("coordinates", { precision: 10, scale: 6 })
    .array()
    .notNull(),
  // Example: [90.4125, 23.8103] => [longitude, latitude]

  experiences: jsonb("experiences").notNull(),
  // ["5 years in engine maintenance", "2 years in brake systems"]

  ...timestamps,
});

export const MechanicWorkshopRelations = relations(
  MechanicWorkshop,
  ({ one }) => ({
    profile: one(UserProfiles, {
      fields: [MechanicWorkshop.user_profile_id],
      references: [UserProfiles.id],
    }),
  })
);
