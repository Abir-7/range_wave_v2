import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ChatRooms } from "../schema/room.schema";
import { db, schema } from "../db";
import { and, eq } from "drizzle-orm";
import { Messages } from "../schema/message.schema";
import redis from "../lib/radis";

const makeNewChatRoom = async (
  data: typeof ChatRooms.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  // Check if exists
  const existing = await client.query.ChatRooms.findFirst({
    where: and(
      eq(ChatRooms.user_id, data.user_id),
      eq(ChatRooms.mechanic_id, data.mechanic_id)
    ),
  });
  if (existing) return existing;
  // Create new if not exist
  const [created] = await client.insert(ChatRooms).values(data).returning();
  return created;
};

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

const getUsersChatList = async (user_id: string) => {
  // 1️⃣ Fetch chat rooms from DB
  const chat_list = await db.query.ChatRooms.findMany({
    where: eq(ChatRooms.user_id, user_id),
    with: {
      user: { columns: { user_id: true, full_name: true, image: true } },
      mechanic: { columns: { user_id: true, full_name: true, image: true } },
      lastMessage: { columns: { created_at: true, message: true } },
    },
    columns: { id: true },
  });

  if (chat_list.length === 0) return [];

  // 2️⃣ Prepare Redis keys
  const keys = chat_list.map((chat) => `unread:${chat.id}:${user_id}`);

  // 3️⃣ Fetch all unread counts in one Redis call
  const unreadCounts = await redis.mget(...keys);

  // 4️⃣ Map unread counts to chat rooms
  return chat_list.map((chat, index) => ({
    ...chat,
    unread_count: unreadCounts[index] ? parseInt(unreadCounts[index]!) : 0,
  }));
};

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

const getMechanicsChatList = async (mechanic_id: string) => {
  const chat_list = await db.query.ChatRooms.findMany({
    where: eq(ChatRooms.mechanic_id, mechanic_id),
    with: {
      user: { columns: { user_id: true, full_name: true, image: true } },
      mechanic: { columns: { user_id: true, full_name: true, image: true } },
      lastMessage: { columns: { created_at: true, message: true } },
    },
    columns: { id: true },
  });

  if (chat_list.length === 0) return [];

  const keys = chat_list.map((chat) => `unread:${chat.id}:${mechanic_id}`);
  const unreadCounts = await redis.mget(...keys);

  return chat_list.map((chat, index) => ({
    ...chat,
    unread_count: unreadCounts[index] ? parseInt(unreadCounts[index]!) : 0,
  }));
};

const getAllMessage = async (chat_room_id: string) => {
  return await db.query.Messages.findMany({
    where: eq(Messages.room_id, chat_room_id),
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
};

const updateChatRoom = async (
  chat_room_id: string,
  last_message_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const updated_data = await client
    .update(ChatRooms)
    .set({ last_message_id, updated_at: new Date() })
    .where(eq(ChatRooms.id, chat_room_id));
  return updated_data;
};

const saveMessage = async (
  data: typeof Messages.$inferInsert,
  chat_room_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [new_message] = await client.insert(Messages).values(data).returning();
  return new_message;
};

export const ChatRepository = {
  makeNewChatRoom,
  getUsersChatList,
  getMechanicsChatList,
  getAllMessage,
  updateChatRoom,
  saveMessage,
};
