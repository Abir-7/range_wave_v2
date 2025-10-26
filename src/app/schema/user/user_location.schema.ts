import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../../db/helper/columns.helpers";

export const UserLocations = pgTable("user_locations", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id").references(() => UserProfiles.user_id, {
    onDelete: "cascade",
  }),

  apartment_no: varchar("apartment_no", { length: 50 }),
  road_no: varchar("road_no", { length: 50 }),
  state: varchar("state", { length: 100 }),
  city: varchar("city", { length: 100 }),
  zip_code: varchar("zip_code", { length: 20 }),
  address: text("address"),
  country: varchar("country", { length: 100 }),

  ...timestamps,
});

export const UserLocationsRelations = relations(UserLocations, ({ one }) => ({
  profile: one(UserProfiles, {
    fields: [UserLocations.user_id],
    references: [UserProfiles.user_id],
  }),
}));
