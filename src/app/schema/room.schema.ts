import { pgTable, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "../db/helper/columns.helpers";

import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { Messages } from "./message.schema";

export const ChatRooms = pgTable("chat_rooms", {
  id: uuid("id").defaultRandom().primaryKey(),

  user_id: uuid("user_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  mechanic_id: uuid("mechanic_id")
    .notNull()
    .references(() => UserProfiles.user_id, { onDelete: "cascade" }),

  last_message_id: uuid("last_message_id"),
  ...timestamps,
});

export const ChatRoomsRelations = relations(ChatRooms, ({ one, many }) => ({
  user: one(UserProfiles, {
    fields: [ChatRooms.user_id],
    references: [UserProfiles.user_id],
  }),

  mechanic: one(UserProfiles, {
    fields: [ChatRooms.mechanic_id],
    references: [UserProfiles.user_id],
  }),

  // Relation to Messages
  lastMessage: one(Messages, {
    fields: [ChatRooms.last_message_id],
    references: [Messages.id],
  }),

  messages: many(Messages),
}));
