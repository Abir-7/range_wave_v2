import { and, eq, ne } from "drizzle-orm";
import { db } from "../db";
import { Bids } from "../schema/bid.schema";
import { Services } from "../schema/service.schema";

import { RatingByMechanic } from "../schema/given_by_mechanic.schema";
import { sql } from "drizzle-orm";

import { Repository } from "./helper.repository";
import { UserProfiles } from "../schema/user_profiles.schema";
import { ServiceProgress } from "../schema/service_progress.schema";
import { Users } from "../schema/user.schema";
import { MechanicWorkshop } from "../schema/mechanics_workshop.schema";

const addBid = async (data: typeof Bids.$inferInsert) => {
  const [created_bid] = await db.insert(Bids).values(data).returning();
  return created_bid;
};

const getMechanicBidHistory = async (mechanicId: string) => {
  const rows = await db
    .select({
      service: {
        id: Services.id,
        issue: Services.issue,
        description: Services.description,
        scheduled_date: Services.scheduled_date,
        created_at: Services.created_at,
        coordinates: Services.coordinates,
      },
      progress: {
        is_scheduled: ServiceProgress.is_scheduled,
      },
      user_profile: {
        full_name: UserProfiles.full_name,
        mobile: UserProfiles.mobile,
        image: UserProfiles.image,
      },
      user: {
        id: Users.id,
        email: Users.email,
      },
      average_rating:
        sql<number>`COALESCE(AVG(${RatingByMechanic.rating}), 0)`.as(
          "average_rating"
        ),
    })
    .from(Bids)
    .innerJoin(Services, eq(Services.id, Bids.service_id))
    .innerJoin(ServiceProgress, eq(ServiceProgress.service_id, Services.id))
    .leftJoin(UserProfiles, eq(Services.user_id, UserProfiles.user_id))
    .leftJoin(Users, eq(Services.user_id, Users.id))
    .leftJoin(RatingByMechanic, eq(RatingByMechanic.user_id, Services.user_id))
    .where(eq(Bids.mechanic_id, mechanicId))
    .groupBy(Services.id, ServiceProgress.id, UserProfiles.id, Users.id);

  // Shape rows
  const shaped = rows.map((r) => ({
    service: {
      ...r.service,
      is_scheduled: r.progress.is_scheduled,
    },
    user: {
      ...r.user,
      ...r.user_profile,
      avg_rating: Number(Number(r.average_rating).toFixed(1)),
    },
  }));

  // Split to scheduled & not_scheduled
  const scheduled = shaped.filter((x) => x.service.is_scheduled === true);
  const not_scheduled = shaped.filter((x) => x.service.is_scheduled === false);

  return {
    scheduled,
    not_scheduled,
  };
};

//================== user ==================

const getBidListOfaService = async (service_id: string) => {
  const bid_list = await db
    .select({
      bid_id: Bids.id,
      price: Bids.price,
      // mechanic_user_id: Bids.mechanic_id,
      status: Bids.status,
      mechanic: {
        user_id: UserProfiles.user_id,
        full_name: UserProfiles.full_name,
        mobile: UserProfiles.mobile,
        image: UserProfiles.image,
        coordinates: MechanicWorkshop.coordinates,
      },
      avg_rating: sql<number>`
        (SELECT AVG(r.rating) 
         FROM rating_by_user r 
         WHERE r.mechanic_id = ${Bids.mechanic_id}
        )
      `.as("avg_rating"),
      total_rating: sql<number>`
        (SELECT COUNT(r.id) 
         FROM rating_by_user r 
         WHERE r.mechanic_id = ${Bids.mechanic_id}
        )
      `.as("total_rating"),
    })
    .from(Bids)
    .leftJoin(UserProfiles, eq(UserProfiles.user_id, Bids.mechanic_id))
    .leftJoin(MechanicWorkshop, eq(Bids.mechanic_id, MechanicWorkshop.user_id))
    .where(
      and(
        eq(Bids.service_id, service_id),
        eq(Bids.status, "provided") // example: add more conditions here
      )
    );

  return bid_list.map((bid) => ({
    ...bid,
    avg_rating: Number(bid.avg_rating ?? 0),
    total_rating: Number(bid.total_rating ?? 0),
  }));
};

const getBidDetails = async (bid_id: string) => {
  const data = await db.query.Bids.findFirst({
    where: eq(Bids.id, bid_id),
    columns: {
      service_id: true,
      id: true,
      price: true,
      mechanic_id: true,
      created_at: true,
    },
    with: {
      mechanic: {
        columns: {
          address: true,
          full_name: true,
          image: true,
          mobile: true,
          //  user_id: true,
        },
      },
      mechanic_workshop: {
        columns: {
          //user_id: true,
          workshop_name: true,
          services: true,
          location_name: true,
          certificates: true,
          coordinates: true,
          experiences: true,
          start_time: true,
          end_time: true,
        },
      },
    },
  });

  const avgRating =
    data && data.id
      ? await Repository.getAvgRatingOfAMechanic(data!.mechanic_id)
      : null;

  return avgRating
    ? {
        ...data,
        rating: {
          avg_rating: Number(Number(avgRating[0].avg_rating).toFixed(1)),
          total_ratings: Number(avgRating[0].total_ratings),
        },
      }
    : {};
};

const handleMechanicBidStatus = async (bidId: string) => {
  // for bg job when hired
  const [bid] = await db.select().from(Bids).where(eq(Bids.id, bidId));

  if (!bid) {
    throw new Error("Bid not found");
  }

  const { service_id } = bid;

  // 2️⃣ Update the chosen bid to 'accepted'
  await db
    .update(Bids)
    .set({ bid_hired_status: "accepted" })
    .where(eq(Bids.id, bidId));

  // 3️⃣ Update all other bids for the same service to 'declined'
  await db
    .update(Bids)
    .set({ bid_hired_status: "declined" })
    .where(and(eq(Bids.service_id, service_id), ne(Bids.id, bidId)));

  return { message: "Bid accepted and other bids declined" };
};

export const BidRepository = {
  addBid,
  getMechanicBidHistory,
  getBidListOfaService,
  getBidDetails,
  handleMechanicBidStatus,
};
