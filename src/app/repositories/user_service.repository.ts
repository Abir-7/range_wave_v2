import { Repository } from "./helper.repository";
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
        is_scheduled: ServiceProgress.is_scheduled,
        coordinates: Services.coordinates,
        //  address: Services.address,
      },
      average_rating:
        sql<number>`COALESCE(AVG(${RatingByMechanic.rating}), 0)`.as(
          "average_rating"
        ),
      user_profile_details: {
        //  user_id: UserProfiles.user_id,
        full_name: UserProfiles.full_name,
        mobile: UserProfiles.mobile,
        image: UserProfiles.image,
      },
      user_details: {
        id: Users.id,
        email: Users.email,
        // role: Users.role,
        // is_verified: Users.is_verified,
        // status: Users.status,
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
    .groupBy(Services.id, UserProfiles.id, Users.id, ServiceProgress.id)
    .orderBy(desc(Services.created_at));
  console.log(data);

  const raw = data.map((service) => ({
    service: service.service,
    user: {
      ...service.user_details,
      ...service.user_profile_details,
      avg_rating: Number(Number(service.average_rating).toFixed(1)),
    },
  }));
  const scheduled = raw.filter((x) => x.service.is_scheduled === true);
  const not_scheduled = raw.filter((x) => x.service.is_scheduled === false);
  return {
    scheduled,
    not_scheduled,
  };
};

const getServiceDetails = async (s_id: string) => {
  const service = await db
    .select({
      service: {
        id: Services.id,
        issue: Services.issue,
        description: Services.description,
        coordinates: Services.coordinates,
        created_at: Services.created_at,
        user_id: Services.user_id,
        address: Services.address,
      },
      user_profile: {
        full_name: UserProfiles.full_name,
        address: UserProfiles.address,
        mobile: UserProfiles.mobile,
        image: UserProfiles.image,
      },
    })
    .from(Services)
    .leftJoin(UserProfiles, eq(UserProfiles.user_id, Services.user_id))
    .where(eq(Services.id, s_id))
    .limit(1);

  const avgResult = await Repository.getAvgRatingOfAUser(
    service[0].service.user_id
  );

  return {
    ...service[0],

    rating: {
      avg_rating: Number(Number(avgResult[0].avg_rating).toFixed(1)),
      total: Number(avgResult[0].total_ratings),
    },
  };
};

//================== common ======================

const runningServiceDetails = async (s_id: string) => {
  const data = await db.query.ServiceProgress.findFirst({
    where: eq(ServiceProgress.service_id, s_id),
    columns: {
      extra_issue: true,
      extra_price: true,
      is_scheduled: true,
      extra_issue_description: true,
      service_status: true,
    },
    with: {
      bid_data: {
        columns: { id: true, price: true },
        with: {
          mechanic: {
            columns: { full_name: true, image: true, mobile: true },
            with: {
              user: { columns: { email: true, role: true, id: true } },
              work_shop: {
                columns: { coordinates: true, location_name: true },
              },
            },
          },
        },
      },

      service_data: {
        columns: {
          id: true,
          issue: true,
          description: true,
          scheduled_date: true,
          coordinates: true,
        },
        with: {
          user: {
            columns: { full_name: true, image: true, mobile: true },
            with: { user: { columns: { email: true, role: true, id: true } } },
          },
        },
      },
    },
  });

  if (!data) return null;

  const mechanicId = data.bid_data?.mechanic.user?.id;
  const userId = data.service_data?.user.user?.id;

  const [mechanic_rating, user_rating] = await Promise.all([
    mechanicId ? Repository.getAvgRatingOfAMechanic(mechanicId) : null,
    userId ? Repository.getAvgRatingOfAUser(userId) : null,
  ]);

  const formatRating = (ratingArray: any) =>
    ratingArray?.[0]
      ? {
          avg_rating:
            Math.round(Number(ratingArray[0].avg_rating || 0) * 10) / 10,
          total_ratings: Number(ratingArray[0].total_ratings) || 0,
        }
      : { avg_rating: 0, total_ratings: 0 };

  return {
    service_data: {
      id: data.service_data?.id || null,
      issue: data.service_data?.issue || null,
      description: data.service_data?.description || null,
      scheduled_date: data.service_data?.scheduled_date || null,
      coordinates: data.service_data?.coordinates || null,
      is_scheduled: data.is_scheduled,
      service_status: data.service_status,
      extra_issue: data.extra_issue,
      extra_issue_description: data.extra_issue_description,
      extra_price: Number(data.extra_price),
    },
    user_data: {
      full_name: data.service_data?.user.full_name || null,
      image: data.service_data?.user.image || null,
      mobile: data.service_data?.user.mobile || null,
      email: data.service_data?.user.user?.email || null,
      role: data.service_data?.user.user?.role || null,
      rating: formatRating(user_rating),
    },
    mechanic_data: {
      full_name: data.bid_data?.mechanic.full_name || null,
      image: data.bid_data?.mechanic.image || null,
      mobile: data.bid_data?.mechanic.mobile || null,
      email: data.bid_data?.mechanic.user?.email || null,
      role: data.bid_data?.mechanic.user?.role || null,
      work_shop_coordinates:
        data.bid_data?.mechanic.work_shop?.coordinates || null,
      work_shop_name: data.bid_data?.mechanic.work_shop?.location_name || null,
      rating: formatRating(mechanic_rating),
    },
    bid_data: {
      bid_id: data.bid_data?.id || null,
      bid_price: Number(data.bid_data?.price) || null,
    },
  };
};

//Other-====================

const getServiceProgressById = async (sp_id: string) => {
  const data = await db.query.ServiceProgress.findFirst({
    where: eq(ServiceProgress.id, sp_id),
  });
  return data;
};

export const ServiceRepository = {
  makeServiceReq,
  makeServiceProgres,

  getAvailableServicesForMechanic,
  getServiceProgressById,
  getServiceDetails,
  runningServiceDetails,
};
