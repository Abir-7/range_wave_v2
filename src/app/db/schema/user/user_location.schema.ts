import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../../helper/columns.helpers";

export const UserLocations = pgTable("user_locations", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_profile_id: uuid("user_profile_id")
    .notNull()
    .references(() => UserProfiles.id, { onDelete: "cascade" }),

  apartment_no: varchar("apartment_no", { length: 50 }).notNull(),
  road_no: varchar("road_no", { length: 50 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zip_code: varchar("zip_code", { length: 20 }).notNull(),
  address: text("address").notNull(),
  country: varchar("country", { length: 100 }).notNull(),

  ...timestamps,
});

export const UserLocationsRelations = relations(UserLocations, ({ one }) => ({
  profile: one(UserProfiles, {
    fields: [UserLocations.user_profile_id],
    references: [UserProfiles.id],
  }),
}));
