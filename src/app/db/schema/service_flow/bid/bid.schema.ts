import { pgTable, uuid, numeric, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Services } from "../service/service.schema";
import { UserProfiles } from "../../user/user_profiles.schema";
import { timestamps } from "../../../helper/columns.helpers";
import { ServiceProgress } from "../progress/service_progress.schema";
import { MechanicWorkshop } from "../../user/mechanics_workshop.schema";

// Enum for bid status
export const bidStatusEnum = pgEnum("bid_status", ["provided", "declined"]);

// Bids table
export const Bids = pgTable("bids", {
  id: uuid("id").primaryKey().defaultRandom(),

  service_id: uuid("service_id")
    .notNull()
    .references(() => Services.id, { onDelete: "set null" }),
  mechanic_id: uuid("mechanic_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "set null" }),
  price: numeric("price", { precision: 20, scale: 2 }).notNull(),
  status: bidStatusEnum("status").notNull(),
  ...timestamps,
});

// Relations
export const BidsRelations = relations(Bids, ({ one }) => ({
  service: one(Services, {
    fields: [Bids.service_id],
    references: [Services.id],
  }),
  mechanic: one(UserProfiles, {
    fields: [Bids.mechanic_id],
    references: [UserProfiles.user_id],
  }),
  mechanic_workshop: one(MechanicWorkshop, {
    fields: [Bids.mechanic_id],
    references: [MechanicWorkshop.user_id],
  }),
  service_progress: one(ServiceProgress, {
    fields: [Bids.id],
    references: [ServiceProgress.bid_id],
  }),
}));
