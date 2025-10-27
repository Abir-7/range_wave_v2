"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesRelations = exports.Messages = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const room_schema_1 = require("../room/room.schema");
const user_profiles_schema_1 = require("../../user/user_profiles.schema");
const columns_helpers_1 = require("../../../db/helper/columns.helpers");
exports.Messages = (0, pg_core_1.pgTable)("messages", Object.assign({ id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(), room_id: (0, pg_core_1.uuid)("room_id").references(() => room_schema_1.ChatRooms.id, {
        onDelete: "cascade",
    }), sender_id: (0, pg_core_1.uuid)("sender_id")
        .notNull()
        .references(() => user_profiles_schema_1.UserProfiles.user_id, { onDelete: "cascade" }), message: (0, pg_core_1.text)("message"), image_id: (0, pg_core_1.text)("image_id"), image: (0, pg_core_1.text)("image") }, columns_helpers_1.timestamps));
exports.MessagesRelations = (0, drizzle_orm_1.relations)(exports.Messages, ({ one }) => ({
    sender: one(user_profiles_schema_1.UserProfiles, {
        fields: [exports.Messages.sender_id],
        references: [user_profiles_schema_1.UserProfiles.user_id],
    }),
}));
