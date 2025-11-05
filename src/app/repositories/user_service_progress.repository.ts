import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { db, schema } from "../db";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { RatingByUser } from "../schema/given_by_user.schema";
import { RatingByMechanic } from "../schema/given_by_mechanic.schema";

import { alias } from "drizzle-orm/pg-core";
import { Services } from "../schema/service.schema";
import { Bids } from "../schema/bid.schema";
import { TUserRole } from "../middleware/auth/auth.interface";
import { UserProfiles } from "../schema/user_profiles.schema";
import {
  ServiceProgress,
  TServiceStatus,
} from "../schema/service_progress.schema";

const updateServiceProgress = async (
  data: Partial<typeof ServiceProgress.$inferInsert>,
  service_id: string | null,
  service_progress_id: string | null,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const orConditions = [];

  if (service_id) {
    orConditions.push(eq(ServiceProgress.service_id, service_id));
  }

  if (service_progress_id) {
    orConditions.push(eq(ServiceProgress.id, service_progress_id));
  }

  if (orConditions.length === 0) {
    throw new Error("At least one identifier must be provided");
  }

  const [updated] = await client
    .update(ServiceProgress)
    .set({ ...data, updated_at: new Date() })
    .where(or(...orConditions)) // <-- any one can match
    .returning();

  return updated;
};

const findServiceProgressData = async (
  s_id: string | null,
  sp_id: string | null
) => {
  let whereClause;

  if (s_id) {
    whereClause = eq(ServiceProgress.service_id, s_id);
  } else if (sp_id) {
    whereClause = eq(ServiceProgress.id, sp_id);
  } else {
    throw new Error(
      "Either service_id or service_progress_id must be provided"
    );
  }

  return await db.query.ServiceProgress.findFirst({
    where: whereClause,
    with: {
      bid_data: {
        columns: { price: true, mechanic_id: true },
      },
    },
  });
};

const getUsersRunningProgress = async (user_id: string) => {
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
      service_id: ServiceProgress.service_id,
      created_at: ServiceProgress.created_at,
      updated_at: ServiceProgress.updated_at,
    })
    .from(ServiceProgress)
    .where(
      and(
        eq(ServiceProgress.user_id, user_id),
        inArray(ServiceProgress.service_status, runningStatuses)
      )
    )
    .orderBy(desc(ServiceProgress.updated_at))
    .limit(1);
  return result[0] || null;
};
const getUsersAllRunningServiceProgress = async (
  status: TServiceStatus,
  user_id: string
) => {
  const result = await db
    .select({
      // bid_id: ServiceProgress.bid_id,
      // extra_issue: ServiceProgress.extra_issue,
      // extra_issue_description: ServiceProgress.extra_issue_description,
      extra_price: ServiceProgress.extra_price,
      service_status: ServiceProgress.service_status,
      is_scheduled: ServiceProgress.is_scheduled,
      updated_at: ServiceProgress.updated_at,
      user_avg_rating: sql<number>`COALESCE(${userAvgRatingSubquery.user_avg_rating}, 0)`,
      mechanic_avg_rating: sql<number>`COALESCE(${mechanicAvgRatingSubquery.mechanic_avg_rating}, 0)`,
      user_profile: {
        user_id: userProfile.user_id,
        full_name: userProfile.full_name,
        image: userProfile.image,
        mobile: userProfile.mobile,
      },
      service: {
        id: Services.id,
        //  user_id: Services.user_id,
        issue: Services.issue,
        description: Services.description,
        //    scheduled_date: Services.scheduled_date,
        //   address: Services.address,
        //    coordinates: Services.coordinates,
        // created_at: Services.created_at,
        // updated_at: Services.updated_at,
        // deleted_at: Services.deleted_at,
      },
      bid: {
        id: Bids.id,
        // service_id: Bids.service_id,
        //  mechanic_id: Bids.mechanic_id,
        price: Bids.price,
        // status: Bids.status,
        // created_at: Bids.created_at,
        // updated_at: Bids.updated_at,
        // deleted_at: Bids.deleted_at,
      },
      mechanic_profile: {
        user_id: mechanicProfile.user_id,
        full_name: mechanicProfile.full_name,
        image: mechanicProfile.image,
        mobile: mechanicProfile.mobile,
      },
    })
    .from(ServiceProgress)
    .leftJoin(userProfile, eq(userProfile.user_id, ServiceProgress.user_id))
    .leftJoin(
      mechanicProfile,
      eq(mechanicProfile.user_id, ServiceProgress.mechanic_id)
    )
    .leftJoin(Services, eq(ServiceProgress.service_id, Services.id))
    .leftJoin(Bids, eq(ServiceProgress.bid_id, Bids.id))
    .leftJoin(
      userAvgRatingSubquery,
      eq(userAvgRatingSubquery.user_id, ServiceProgress.user_id)
    )
    .leftJoin(
      mechanicAvgRatingSubquery,
      eq(mechanicAvgRatingSubquery.mechanic_id, ServiceProgress.mechanic_id)
    )
    .where(
      and(
        eq(ServiceProgress.user_id, user_id),
        eq(ServiceProgress.service_status, status)
      )
    )
    .orderBy(desc(ServiceProgress.updated_at));

  return result;
};

const getMechanicsAllRunningServiceProgress = async (
  status: TServiceStatus,
  mechanic_id: string
) => {
  const result = await db
    .select({
      // bid_id: ServiceProgress.bid_id,
      // extra_issue: ServiceProgress.extra_issue,
      // extra_issue_description: ServiceProgress.extra_issue_description,
      extra_price: ServiceProgress.extra_price,
      service_status: ServiceProgress.service_status,
      is_scheduled: ServiceProgress.is_scheduled,
      updated_at: ServiceProgress.updated_at,
      user_avg_rating: sql<number>`COALESCE(${userAvgRatingSubquery.user_avg_rating}, 0)`,
      mechanic_avg_rating: sql<number>`COALESCE(${mechanicAvgRatingSubquery.mechanic_avg_rating}, 0)`,
      user_profile: {
        user_id: userProfile.user_id,
        full_name: userProfile.full_name,
        image: userProfile.image,
        mobile: userProfile.mobile,
      },
      service: {
        id: Services.id,
        //  user_id: Services.user_id,
        issue: Services.issue,
        description: Services.description,
        //    scheduled_date: Services.scheduled_date,
        //   address: Services.address,
        //    coordinates: Services.coordinates,
        // created_at: Services.created_at,
        // updated_at: Services.updated_at,
        // deleted_at: Services.deleted_at,
      },
      bid: {
        id: Bids.id,
        // service_id: Bids.service_id,
        //  mechanic_id: Bids.mechanic_id,
        price: Bids.price,
        // status: Bids.status,
        // created_at: Bids.created_at,
        // updated_at: Bids.updated_at,
        // deleted_at: Bids.deleted_at,
      },
      mechanic_profile: {
        user_id: mechanicProfile.user_id,
        full_name: mechanicProfile.full_name,
        image: mechanicProfile.image,
        mobile: mechanicProfile.mobile,
      },
    })
    .from(ServiceProgress)
    .leftJoin(userProfile, eq(userProfile.user_id, ServiceProgress.user_id))
    .leftJoin(
      mechanicProfile,
      eq(mechanicProfile.user_id, ServiceProgress.mechanic_id)
    )
    .leftJoin(Services, eq(ServiceProgress.service_id, Services.id))
    .leftJoin(Bids, eq(ServiceProgress.bid_id, Bids.id))
    .leftJoin(
      userAvgRatingSubquery,
      eq(userAvgRatingSubquery.user_id, ServiceProgress.user_id)
    )
    .leftJoin(
      mechanicAvgRatingSubquery,
      eq(mechanicAvgRatingSubquery.mechanic_id, ServiceProgress.mechanic_id)
    )
    .where(
      and(
        eq(ServiceProgress.mechanic_id, mechanic_id),
        eq(ServiceProgress.service_status, status)
      )
    )
    .orderBy(desc(ServiceProgress.updated_at));

  return result;
};
const getMechanicsRunningProgress = async (mechanic_id: string) => {
  // Allowed running statuses
  const runningStatuses = ["ON_THE_WAY", "WORKING", "NEED_TO_PAY"] as const;

  // Query latest service with its progress
  const result = await db
    .select({
      service_id: ServiceProgress.service_id,
      created_at: ServiceProgress.created_at,
      updated_at: ServiceProgress.updated_at,
    })
    .from(ServiceProgress)
    .where(
      and(
        eq(ServiceProgress.mechanic_id, mechanic_id),
        inArray(ServiceProgress.service_status, runningStatuses)
      )
    )
    .orderBy(desc(ServiceProgress.updated_at))
    .limit(1);
  return result[0] || null;
};

const cancelService = async (s_id: string, reason: string, role: TUserRole) => {
  const [data] = await db
    .update(ServiceProgress)
    .set({
      service_status: "CANCELLED",
      cancel_reason: reason,
      cancel_by:
        role === "mechanic" ? "MECHANIC" : role === "user" ? "USER" : "ADMIN",
    })
    .where(eq(ServiceProgress.id, s_id))
    .returning();
  return data;
};

const usersCarServiceHistory = async (user_id: string) => {
  const history = await db.query.ServiceProgress.findMany({
    where: eq(ServiceProgress.user_id, user_id),
    with: { service_data: { with: { car_info: true } }, payment: true },
  });
};

export const ServiceProgressRepository = {
  updateServiceProgress,
  findServiceProgressData,
  getMechanicsRunningProgress,
  getUsersRunningProgress,
  getMechanicsAllRunningServiceProgress,
  getUsersAllRunningServiceProgress,
  cancelService,
  usersCarServiceHistory,
};

// ====================== SubQuery =============================

// Mechanic’s average rating (rated by users)
// Mechanic’s average rating (rated by users)
const mechanicAvgRatingSubquery = db
  .select({
    mechanic_id: RatingByUser.mechanic_id,
    mechanic_avg_rating:
      sql<number>`ROUND(AVG(${RatingByUser.rating})::numeric, 2)`.as(
        "mechanic_avg_rating"
      ),
  })
  .from(RatingByUser)
  .groupBy(RatingByUser.mechanic_id)
  .as("mechanic_avg_rating");

// User’s average rating (rated by mechanics)
const userAvgRatingSubquery = db
  .select({
    user_id: RatingByMechanic.user_id,
    user_avg_rating:
      sql<number>`ROUND(AVG(${RatingByMechanic.rating})::numeric, 2)`.as(
        "user_avg_rating"
      ),
  })
  .from(RatingByMechanic)
  .groupBy(RatingByMechanic.user_id)
  .as("user_avg_rating");

// Create aliases for user & mechanic
const userProfile = alias(UserProfiles, "user_profile");
const mechanicProfile = alias(UserProfiles, "mechanic_profile");
