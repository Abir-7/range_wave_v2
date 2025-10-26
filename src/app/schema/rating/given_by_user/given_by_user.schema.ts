import { pgTable, uuid, integer, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "../../user/user_profiles.schema";
import { Services } from "../../service_flow/service/service.schema";
import { timestamps } from "../../../db/helper/columns.helpers";
import { ServiceProgress } from "../../service_flow/progress/service_progress.schema";

export const RatingByUser = pgTable("rating_by_user", {
  id: uuid("id").defaultRandom().primaryKey(),

  rating: integer("rating").notNull(), // e.g., 1-5

  text: text("text").notNull(),

  mechanic_id: uuid("mechanic_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "set null" }),

  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "set null" }),

  service_progress_id: uuid("service_progress_id")
    .notNull()
    .references(() => ServiceProgress.id, { onDelete: "cascade" }),

  ...timestamps,
});

export const RatingByUserRelations = relations(RatingByUser, ({ one }) => ({
  user: one(UserProfiles, {
    fields: [RatingByUser.user_id],
    references: [UserProfiles.user_id],
  }),

  mechanic: one(UserProfiles, {
    fields: [RatingByUser.mechanic_id],
    references: [UserProfiles.user_id],
  }),

  service: one(ServiceProgress, {
    fields: [RatingByUser.service_progress_id],
    references: [ServiceProgress.id],
  }),
}));
