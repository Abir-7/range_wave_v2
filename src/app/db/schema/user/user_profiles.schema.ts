import { MechanicPaymentData } from "./mechanic_payment_data.schema";
import { pgTable, uuid, varchar, text, pgEnum } from "drizzle-orm/pg-core";

import { timestamps } from "../../helper/columns.helpers";
import { Users } from "./user.schema";
import { relations } from "drizzle-orm";
import { Services } from "../service_flow/service/service.schema";
import { UserCars } from "./user_carinfo.schema";
import { MechanicWorkshop } from "./mechanics_workshop.schema";
import { UserLocations } from "./user_location.schema";
import { boolean } from "drizzle-orm/pg-core";

// Optional: Gender enum
export const genders = ["male", "female", "other"] as const;
export type TGender = (typeof genders)[number];
export const genderEnum = pgEnum("gender_enum", genders);

// UserProfiles table
export const UserProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),

  // FK to users table, must exist
  user_id: uuid("user_id")
    .notNull()
    .unique()
    .references(() => Users.id, { onDelete: "cascade" }),

  full_name: varchar("full_name", { length: 100 }).notNull(),

  // Optional fields
  user_name: varchar("user_name", { length: 50 }).unique(), // nullable
  mobile: varchar("mobile", { length: 20 }).unique(), // nullable
  address: text("address"), // nullable
  gender: genderEnum("gender"), // nullable
  image: text("image"), // nullable
  is_profile_completed: boolean("is_profile_completed")
    .notNull()
    .default(false),
  ...timestamps,
});

export const UserProfilesRelations = relations(
  UserProfiles,
  ({ one, many }) => ({
    user: one(Users),
    services: many(Services),
    car_info: one(UserCars),
    work_shop: one(MechanicWorkshop),
    location: one(UserLocations),
    payment_info: one(MechanicPaymentData),
  })
);
