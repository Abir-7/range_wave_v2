import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import { Users } from "../schema/user.schema";
import { UserProfiles } from "../schema/user_profiles.schema";
import { UserLocations } from "../schema/user_location.schema";
import { MechanicWorkshop } from "../schema/mechanics_workshop.schema";
import { MechanicPaymentData } from "../schema/mechanic_payment_data.schema";
import { UserCars } from "../schema/user_carinfo.schema";

const findByEmail = async (email: string) => {
  const [user] = await db.query.Users.findMany({
    where: eq(Users.email, email),
    with: {
      profile: true, // assuming you have a relation named 'profile' in UsersRelations
    },
  });

  return user || null;
};

const findById = async (id: string) => {
  const [user] = await db.select().from(Users).where(eq(Users.id, id));
  return user || null;
};

const getAllUsers = async () => {
  return await db.select().from(Users);
};

const updateUserCarData = async (
  data: Partial<typeof UserCars.$inferInsert>,
  car_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [updated_data] = await client
    .update(UserCars)
    .set({ ...data, updated_at: new Date() })
    .where(eq(UserCars.id, car_id))
    .returning();

  return updated_data;
};
const getAllCarOfaUser = async (user_id: string) => {
  const user_car_data = await db.query.UserCars.findMany({
    where: eq(UserCars.user_id, user_id),
  });
  return user_car_data;
};

const createUserCarinfo = async (
  data: typeof UserCars.$inferInsert,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [user_car_data] = await (trx || db)
    .insert(UserCars)
    .values(data)
    .returning();
  return user_car_data;
};

const getUserSingleCarData = async (car_id: string) => {
  const user_car_data = await db.query.UserCars.findFirst({
    where: eq(UserCars.id, car_id),
  });
  return user_car_data;
};

// -- mechanic data-------------
const getMechanicsWorkshopData = async (mechanic_id: string) => {
  return await db.query.MechanicWorkshop.findFirst({
    where: eq(MechanicWorkshop.user_id, mechanic_id),
  });
};

const getMechanicsPaymentData = async (mechanic_id: string) => {
  return await db.query.MechanicPaymentData.findFirst({
    where: eq(MechanicPaymentData.user_id, mechanic_id),
  });
};

const updateMechanicPaymentData = async (
  data: typeof MechanicPaymentData.$inferInsert,
  mechanic_id: string
) => {
  const [updated_data] = await db
    .update({ ...MechanicPaymentData, updated_at: new Date() })
    .set(data)
    .where(eq(MechanicPaymentData.user_id, mechanic_id))
    .returning();

  return updated_data;
};

const update_workshop_data = async (
  data: typeof MechanicWorkshop.$inferInsert,
  mechanic_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [updated] = await client
    .update(MechanicWorkshop)
    .set({ ...data, updated_at: new Date() })
    .where(eq(MechanicWorkshop.user_id, mechanic_id))
    .returning();
  return updated;
};

//---Common----
const getProfileData = async (user_id: string) => {
  const user_data = await db.query.UserProfiles.findFirst({
    where: eq(UserProfiles.user_id, user_id),
    with: { user: true },
  });
  return user_data;
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
  console.log(data);
  const [profile] = await (trx || db)
    .update(UserProfiles)
    .set({ ...data })
    .where(eq(UserProfiles.user_id, id))
    .returning();
  return profile;
};
const updateLocationData = async (
  data: typeof UserLocations.$inferInsert,
  user_mechanic_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [updated_data] = await client
    .update(UserLocations)
    .set({ ...data })
    .where(eq(UserLocations.user_id, user_mechanic_id))
    .returning();

  return updated_data;
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
  getMechanicsWorkshopData,
  update_workshop_data,
  getMechanicsPaymentData,
  updateUserProfile,
  updateMechanicPaymentData,
  updateLocationData,
  updateUserCarData,
  getProfileData,
  getAllCarOfaUser,
  createUserCarinfo,
  getUserSingleCarData,
};
