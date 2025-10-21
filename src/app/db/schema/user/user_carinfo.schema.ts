import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../../helper/columns.helpers";

export const UserCars = pgTable("user_cars", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  car_name: varchar("car_name", { length: 100 }).notNull(),
  car_model: varchar("car_model", { length: 100 }).notNull(),
  vin_code: varchar("vin_code", { length: 100 }).notNull(),
  license_plate: varchar("license_plate", { length: 50 }).notNull(),
  tag_number: varchar("tag_number", { length: 50 }).notNull(),

  ...timestamps,
});

export const UserCarsRelations = relations(UserCars, ({ one }) => ({
  profile: one(UserProfiles, {
    fields: [UserCars.user_id],
    references: [UserProfiles.id],
  }),
}));
