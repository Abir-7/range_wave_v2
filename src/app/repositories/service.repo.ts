import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db, schema } from "../db";
import { Services } from "../db/schema/service_flow/service/service.schema";
import { ServiceProgress } from "../db/schema/service_flow/progress/service_progress.schema";
import { and, desc, eq, inArray, isNull, notExists, sql } from "drizzle-orm";
import { Bids } from "../db/schema/service_flow/bid/bid.schema";
import { RatingByMechanic } from "../db/schema/rating/given_by_mechanic/given_by_mechanic.schema";
import { UserProfiles } from "../db/schema/user/user_profiles.schema";
import { Users } from "../db/schema/user/user.schema";

const makeServiceReq = async (
  data: typeof Services.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  return await client.insert(Services).values(data).returning();
};

const makeServiceProgres = async (
  data: { service_id: string; user_id: string; is_scheduled: boolean },
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  return await client
    .insert(ServiceProgress)
    .values({ ...data })
    .returning();
};

export const getRunningProgress = async (user_id: string) => {
  // Allowed running statuses
  const runningStatuses = [
    "FINDING",
    "ON_THE_WAY",
    "WORKING",
    "NEED_TO_PAY",
  ] as const;

  // Query latest service with its progress
  const result = await db
    .select({
      service_id: Services.id,
      service_issue: Services.issue,
      service_description: Services.description,
      progress_id: ServiceProgress.id,
      progress_status: ServiceProgress.service_status,
      extra_issue: ServiceProgress.extra_issue,
      extra_price: ServiceProgress.extra_price,
      created_at: ServiceProgress.created_at,
    })
    .from(Services)
    .leftJoin(ServiceProgress, eq(ServiceProgress.service_id, Services.id))
    .where(
      and(
        eq(Services.user_id, user_id),
        inArray(ServiceProgress.service_status, runningStatuses)
      )
    )

    .orderBy(desc(ServiceProgress.created_at))
    .limit(1);
  return result[0] || null;
};

//----------------------For mechanics------------------
const getAvailableServicesForMechanic = async (mechanicId: string) => {
  const data = await db
    .select({
      service: {
        id: Services.id,
        issue: Services.issue,
        description: Services.description,
        scheduled_date: Services.scheduled_date,
        created_at: Services.created_at,
      },
      average_rating:
        sql<number>`COALESCE(AVG(${RatingByMechanic.rating}), 0)`.as(
          "average_rating"
        ),
      user_profile_details: {
        user_id: UserProfiles.user_id,
        full_name: UserProfiles.full_name,
        mobile: UserProfiles.mobile,
        image: UserProfiles.image,
      },
      user_details: {
        id: Users.id,
        email: Users.email,
        role: Users.role,
        is_verified: Users.is_verified,
        status: Users.status,
      },
    })
    .from(Services)
    .leftJoin(UserProfiles, eq(UserProfiles.user_id, Services.user_id))
    .leftJoin(Users, eq(Users.id, Services.user_id))
    .innerJoin(ServiceProgress, eq(ServiceProgress.service_id, Services.id))
    .leftJoin(RatingByMechanic, eq(RatingByMechanic.user_id, Services.user_id))
    .where(
      and(
        eq(ServiceProgress.service_status, "FINDING"),
        isNull(ServiceProgress.bid_id),
        notExists(
          db
            .select()
            .from(Bids)
            .where(
              and(
                eq(Bids.service_id, Services.id),
                eq(Bids.mechanic_id, mechanicId)
              )
            )
        )
      )
    )
    .groupBy(Services.id, UserProfiles.id, Users.id)
    .orderBy(desc(Services.created_at));
  console.log(data);

  return data;
};

export const ServiceRepository = {
  makeServiceReq,
  makeServiceProgres,
  getRunningProgress,
  getAvailableServicesForMechanic,
};
