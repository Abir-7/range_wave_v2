import { schema } from "./../db/index";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Users } from "../db/schema/user/user.schema";

import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";

import { UserProfiles } from "../db/schema/user/user_profiles.schema";
import { UserAuthentications } from "../db/schema/user/user_authentication.schema";
import { MechanicWorkshop } from "../db/schema/user/mechanics_workshop.schema";
import { MechanicPaymentData } from "../db/schema/user/mechanic_payment_data.schema";

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
};
