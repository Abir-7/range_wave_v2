import { pgTable, uuid, integer, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserProfiles } from "../../user/user_profiles.schema";
import { Services } from "../../service_flow/service/service.schema";
import { timestamps } from "../../../helper/columns.helpers";

export const RatingByUser = pgTable("rating_by_user", {
  id: uuid("id").defaultRandom().primaryKey(),

  rating: integer("rating").notNull(), // e.g., 1-5

  text: text("text").notNull(),

  mechanic_id: uuid("mechanic_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  service_id: uuid("service_id")
    .notNull()
    .references(() => Services.id, { onDelete: "cascade" }),

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

  service: one(Services, {
    fields: [RatingByUser.service_id],
    references: [Services.id],
  }),
}));
