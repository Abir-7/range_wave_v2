import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ChatRooms } from "../room/room.schema";
import { UserProfiles } from "../../user/user_profiles.schema";
import { timestamps } from "../../../db/helper/columns.helpers";

export const Messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  room_id: uuid("room_id").notNull(),
  sender_id: uuid("sender_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  message: text("message").notNull(),
  ...timestamps,
});

export const MessagesRelations = relations(Messages, ({ one }) => ({
  sender: one(UserProfiles, {
    fields: [Messages.sender_id],
    references: [UserProfiles.user_id],
  }),
}));
