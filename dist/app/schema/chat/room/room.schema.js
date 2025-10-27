"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomsRelations = exports.ChatRooms = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_profiles_schema_1 = require("../../user/user_profiles.schema");
const message_schema_1 = require("../message/message.schema");
const columns_helpers_1 = require("../../../db/helper/columns.helpers");
const drizzle_orm_1 = require("drizzle-orm");
exports.ChatRooms = (0, pg_core_1.pgTable)("chat_rooms", Object.assign({ id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(), user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "cascade" }), mechanic_id: (0, pg_core_1.uuid)("mechanic_id")
        .notNull()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "cascade" }), last_message_id: (0, pg_core_1.uuid)("last_message_id") }, columns_helpers_1.timestamps));
exports.ChatRoomsRelations = (0, drizzle_orm_1.relations)(exports.ChatRooms, ({ one, many }) => ({
    user: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.ChatRooms.user_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    mechanic: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.ChatRooms.mechanic_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
    // Relation to Messages
    lastMessage: one(message_schema_1.Messages, {
        fields: [exports.ChatRooms.last_message_id],
        references: [message_schema_1.Messages.id],
    }),
    messages: many(message_schema_1.Messages),
}));
