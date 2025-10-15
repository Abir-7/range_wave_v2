import { eq } from "drizzle-orm";
import { db } from "../db";
import { Users } from "../db/schema/user/user.schema";
import { DatabaseTransaction } from "./helper.repo";

const findByEmail = async (email: string) => {
  const [user] = await db.select().from(Users).where(eq(Users.email, email));
  return user || null;
};

const findById = async (id: string) => {
  const [user] = await db.select().from(Users).where(eq(Users.id, id));
  return user || null;
};

const getAllUsers = async () => {
  return await db.select().from(Users);
};

const updateUser = async (
  id: string,
  data: Partial<typeof Users.$inferInsert>,
  trx?: DatabaseTransaction
) => {
  const [user] = await (trx || db)
    .update(Users)
    .set({ ...data, updated_at: new Date() })
    .where(eq(Users.id, id))
    .returning();
  return user;
};

const deleteUser = async (id: string) => {
  await db.delete(Users).where(eq(Users.id, id));
  return true;
};

export const UserRepository = {
  findByEmail,
  findById,
  getAllUsers,
  updateUser,
  deleteUser,
};
