import { pgTable, uuid, numeric, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Services } from "../service/service.schema";
import { UserProfiles } from "../../user/user_profiles.schema";
import { timestamps } from "../../../helper/columns.helpers";

// Enum for bid status
export const bidStatusEnum = pgEnum("bid_status", ["provided", "declined"]);

// Bids table
export const Bids = pgTable("bids", {
  id: uuid("id").primaryKey().defaultRandom(),

  req_service_id: uuid("req_service_id")
    .notNull()
    .references(() => Services.id, { onDelete: "cascade" }),

  mechanic_id: uuid("mechanic_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),

  status: bidStatusEnum("status").notNull().default("provided"),

  extra_work: jsonb("extra_work"),
  // Example: { issue: "Brake issue", description: "Fix brake pads", price: 2000 }

  location: jsonb("location").notNull(),
  // Example: { placeId: "xyz123", coordinates: { type: "Point", coordinates: [90.4125, 23.8103] } }

  ...timestamps,
});

// Relations
export const BidsRelations = relations(Bids, ({ one }) => ({
  service: one(Services),
  mechanic: one(UserProfiles),
}));
