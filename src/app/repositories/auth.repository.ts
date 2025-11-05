import { UserLocations } from "./../schema/user_location.schema";
import { schema } from "./../db/index";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { Users } from "../schema/user.schema";
import { UserProfiles } from "../schema/user_profiles.schema";
import { MechanicWorkshop } from "../schema/mechanics_workshop.schema";
import { MechanicPaymentData } from "../schema/mechanic_payment_data.schema";

import { UserAuthentications } from "../schema/user_authentication.schema";

const createUser = async (
  data: typeof Users.$inferInsert,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [user] = await (trx || db).insert(Users).values(data).returning();
  return user;
};

//-----------PROFILE

const createProfile = async (
  data: typeof UserProfiles.$inferInsert,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [profile] = await (trx || db)
    .insert(UserProfiles)
    .values(data)
    .returning();
  return profile;
};

// workshop

const createWorkshop = async (
  data: typeof MechanicWorkshop.$inferInsert,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [workshop] = await (trx || db)
    .insert(MechanicWorkshop)
    .values(data)
    .returning();
  return workshop;
};

// payment info

const createMechanicPaymentInfo = async (
  data: typeof MechanicPaymentData.$inferInsert,
  trx: NodePgDatabase<typeof schema>
) => {
  const [payment_info] = await await (trx || db)
    .insert(MechanicPaymentData)
    .values(data)
    .returning();

  return payment_info;
};

//create car info

const createUserLocationinfo = async (
  data: typeof UserLocations.$inferInsert,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [user_location_data] = await (trx || db)
    .insert(UserLocations)
    .values(data)
    .returning();

  return user_location_data;
};

//---------Authentication

const createAuthentication = async (
  data: typeof UserAuthentications.$inferInsert,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [auth] = await (trx || db)
    .insert(UserAuthentications)
    .values(data)
    .returning();
  return auth;
};

const getAuthenticationByUserIdAndCode = async (
  user_id: string,
  code: string
) => {
  const auth = await db.query.UserAuthentications.findFirst({
    where: and(
      eq(UserAuthentications.user_id, user_id),
      eq(UserAuthentications.otp, code)
    ),
  });

  return auth || null;
};
const getAuthenticationByUserIdAndToken = async (
  user_id: string,
  token: string
) => {
  const auth = await db.query.UserAuthentications.findFirst({
    where: and(
      eq(UserAuthentications.user_id, user_id),
      eq(UserAuthentications.token, token)
    ),
  });

  return auth || null;
};

const getAuthenticationByUserId = async (user_id: string) => {
  const auth = await db.query.UserAuthentications.findFirst({
    where: eq(UserAuthentications.user_id, user_id),
    orderBy: desc(UserAuthentications.created_at),
  });

  return auth || null;
};

const setAuthenticationSuccess = async (
  authId: string,
  value = true,
  trx?: NodePgDatabase<typeof schema>
) => {
  const [data] = await (trx || db)
    .update(UserAuthentications)
    .set({ is_success: value, updated_at: new Date() })
    .where(eq(UserAuthentications.id, authId))
    .returning();
  return data;
};

export const AuthRepository = {
  createUser,
  createProfile,
  createAuthentication,
  getAuthenticationByUserIdAndCode,
  getAuthenticationByUserIdAndToken,
  getAuthenticationByUserId,
  setAuthenticationSuccess,
  createWorkshop,
  createMechanicPaymentInfo,
  createUserLocationinfo,
};
