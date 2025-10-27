"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const room_schema_1 = require("../schema/chat/room/room.schema");
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const message_schema_1 = require("../schema/chat/message/message.schema");
const radis_1 = __importDefault(require("../lib/radis"));
const makeNewChatRoom = (data, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    // Check if exists
    const existing = yield client.query.ChatRooms.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(room_schema_1.ChatRooms.user_id, data.user_id), (0, drizzle_orm_1.eq)(room_schema_1.ChatRooms.mechanic_id, data.mechanic_id)),
    });
    if (existing)
        return existing;
    // Create new if not exist
    const [created] = yield client.insert(room_schema_1.ChatRooms).values(data).returning();
    return created;
});
// const getUsersChatList = async (user_id: string) => {
//   const chat_list = await db.query.ChatRooms.findMany({
//     where: eq(ChatRooms.user_id, user_id),
//     with: {
//       user: { columns: { user_id: true, full_name: true, image: true } },
//       mechanic: { columns: { user_id: true, full_name: true, image: true } },
//       lastMessage: { columns: { created_at: true, message: true } },
//     },
//     columns: { id: true },
//   });
//   return chat_list;
// };
const getUsersChatList = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    // 1️⃣ Fetch chat rooms from DB
    const chat_list = yield db_1.db.query.ChatRooms.findMany({
        where: (0, drizzle_orm_1.eq)(room_schema_1.ChatRooms.user_id, user_id),
        with: {
            user: { columns: { user_id: true, full_name: true, image: true } },
            mechanic: { columns: { user_id: true, full_name: true, image: true } },
            lastMessage: { columns: { created_at: true, message: true } },
        },
        columns: { id: true },
    });
    if (chat_list.length === 0)
        return [];
    // 2️⃣ Prepare Redis keys
    const keys = chat_list.map((chat) => `unread:${chat.id}:${user_id}`);
    // 3️⃣ Fetch all unread counts in one Redis call
    const unreadCounts = yield radis_1.default.mget(...keys);
    // 4️⃣ Map unread counts to chat rooms
    return chat_list.map((chat, index) => (Object.assign(Object.assign({}, chat), { unread_count: unreadCounts[index] ? parseInt(unreadCounts[index]) : 0 })));
});
// const getMechanicsChatList = async (mechanic_id: string) => {
//   const chat_list = await db.query.ChatRooms.findMany({
//     where: eq(ChatRooms.mechanic_id, mechanic_id),
//     with: {
//       user: { columns: { user_id: true, full_name: true, image: true } },
//       mechanic: { columns: { user_id: true, full_name: true, image: true } },
//     },
//   });
//   return chat_list;
// };
const getMechanicsChatList = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const chat_list = yield db_1.db.query.ChatRooms.findMany({
        where: (0, drizzle_orm_1.eq)(room_schema_1.ChatRooms.mechanic_id, mechanic_id),
        with: {
            user: { columns: { user_id: true, full_name: true, image: true } },
            mechanic: { columns: { user_id: true, full_name: true, image: true } },
            lastMessage: { columns: { created_at: true, message: true } },
        },
        columns: { id: true },
    });
    if (chat_list.length === 0)
        return [];
    const keys = chat_list.map((chat) => `unread:${chat.id}:${mechanic_id}`);
    const unreadCounts = yield radis_1.default.mget(...keys);
    return chat_list.map((chat, index) => (Object.assign(Object.assign({}, chat), { unread_count: unreadCounts[index] ? parseInt(unreadCounts[index]) : 0 })));
});
const getAllMessage = (chat_room_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db.query.Messages.findMany({
        where: (0, drizzle_orm_1.eq)(message_schema_1.Messages.room_id, chat_room_id),
        columns: { message: true, id: true, created_at: true },
        with: {
            sender: {
                columns: {
                    full_name: true,
                    user_id: true,
                    image: true,
                },
            },
        },
    });
});
const updateChatRoom = (chat_room_id, last_message_id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const updated_data = yield client
        .update(room_schema_1.ChatRooms)
        .set({ last_message_id, updated_at: new Date() })
        .where((0, drizzle_orm_1.eq)(room_schema_1.ChatRooms.id, chat_room_id));
    return updated_data;
});
const saveMessage = (data, chat_room_id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const [new_message] = yield client.insert(message_schema_1.Messages).values(data).returning();
    return new_message;
});
exports.ChatRepository = {
    makeNewChatRoom,
    getUsersChatList,
    getMechanicsChatList,
    getAllMessage,
    updateChatRoom,
    saveMessage,
};
