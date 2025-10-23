import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ChatRooms } from "../db/schema/chat/room/room.schema";
import { db, schema } from "../db";
import { and, eq } from "drizzle-orm";

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

export const ChatRepository = { makeNewChatRoom };
