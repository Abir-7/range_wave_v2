import {
  pgTable,
  uuid,
  varchar,
  jsonb,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../db/helper/columns.helpers";

export const MechanicWorkshop = pgTable("mechanic_workshops", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  workshop_name: varchar("workshop_name", { length: 150 }),

  start_time: varchar("start_time", { length: 5 }),
  end_time: varchar("end_time", { length: 5 }),

  services: jsonb("services"),

  location_name: varchar("location_name", { length: 150 }),
  place_id: varchar("place_id", { length: 255 }),

  coordinates: numeric("coordinates", { precision: 10, scale: 6 }).array(),

  experiences: jsonb("experiences"),

  certificates: jsonb("certificates").default([]),

  is_conflict: boolean("is_conflict").default(false),

  ...timestamps,
});

export const MechanicWorkshopRelations = relations(
  MechanicWorkshop,
  ({ one }) => ({
    profile: one(UserProfiles, {
      fields: [MechanicWorkshop.user_id],
      references: [UserProfiles.user_id],
    }),
  })
);
