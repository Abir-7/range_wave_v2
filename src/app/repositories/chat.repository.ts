import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ChatRooms } from "../schema/chat/room/room.schema";
import { db, schema } from "../db";
import { and, eq } from "drizzle-orm";
import { Messages } from "../schema/chat/message/message.schema";

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

const getUsersChatList = async (user_id: string) => {
  const chat_list = await db.query.ChatRooms.findMany({
    where: eq(ChatRooms.user_id, user_id),

    with: {
      user: { columns: { user_id: true, full_name: true, image: true } },
      mechanic: { columns: { user_id: true, full_name: true, image: true } },
      lastMessage: { columns: { created_at: true, message: true } },
    },
    columns: { id: true },
  });
  return chat_list;
};

const getMechanicsChatList = async (mechanic_id: string) => {
  const chat_list = await db.query.ChatRooms.findMany({
    where: eq(ChatRooms.mechanic_id, mechanic_id),
    with: {
      user: { columns: { user_id: true, full_name: true, image: true } },
      mechanic: { columns: { user_id: true, full_name: true, image: true } },
    },
  });
  return chat_list;
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

export const ChatRepository = {
  makeNewChatRoom,
  getUsersChatList,
  getMechanicsChatList,
  getAllMessage,
};
