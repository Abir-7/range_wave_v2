import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import { Users } from "../db/schema/user/user.schema";
import { MechanicWorkshop } from "../db/schema/user/mechanics_workshop.schema";
import { UserProfiles } from "../db/schema/user/user_profiles.schema";

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
  trx?: NodePgDatabase<typeof schema>
) => {
  const [user] = await (trx || db)
    .update(Users)
    .set({ ...data, updated_at: new Date() })
    .where(eq(Users.id, id))
    .returning();
  return user;
};
const updateUserProfile = async (
  id: string,
  data: Partial<typeof UserProfiles.$inferInsert>,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [profile] = await (trx || db)
    .update(UserProfiles)
    .set({ ...data, updated_at: new Date() })
    .where(eq(UserProfiles.user_id, id))
    .returning();
  return profile;
};

const deleteUser = async (id: string) => {
  await db.delete(Users).where(eq(Users.id, id));
  return true;
};

// ------------ mechanic data-------------
const getMechanicsWorkshopData = async (mechanic_id: string) => {
  return await db.query.MechanicWorkshop.findFirst({
    where: eq(MechanicWorkshop.user_id, mechanic_id),
  });
};

const update_workshop_data = async (
  data: typeof MechanicWorkshop.$inferInsert,
  mechanic_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [updated] = await client
    .update(MechanicWorkshop)
    .set(data)
    .where(eq(MechanicWorkshop.user_id, mechanic_id))
    .returning();
  return updated;
};

export const UserRepository = {
  findByEmail,
  findById,
  getAllUsers,
  updateUser,
  deleteUser,
  getMechanicsWorkshopData,
  update_workshop_data,
  updateUserProfile,
};
