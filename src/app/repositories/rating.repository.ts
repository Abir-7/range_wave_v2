import { eq } from "drizzle-orm";
import { db } from "../db";
import { RatingByMechanic } from "../schema/given_by_mechanic.schema";
import { Repository } from "./helper.repository";
import { RatingByUser } from "../schema/given_by_user.schema";

const ratingGivenByMechanic = async (
  data: typeof RatingByMechanic.$inferInsert
) => {
  const [rating_data] = await db
    .insert(RatingByMechanic)
    .values(data)
    .returning();
  return rating_data;
};

const ratingGivenByUser = async (data: typeof RatingByUser.$inferInsert) => {
  const [rating_data] = await db.insert(RatingByUser).values(data).returning();
  return rating_data;
};

const getUserRatingData = async (user_id: string) => {
  const ratings = await db.query.RatingByMechanic.findMany({
    where: eq(RatingByMechanic.user_id, user_id),
    columns: {
      rating: true,
      text: true,
      //  mechanic_id: true,
      created_at: true,
    },
    with: {
      mechanic: {
        columns: {
          full_name: true,
          mobile: true,
          image: true,
          user_id: true,
        },
      },
    },
  });

  const avgResult = await Repository.getAvgRatingOfAUser(user_id);

  return {
    ratings,
    avg_rating: Number(Number(avgResult[0].avg_rating).toFixed(1)),
    total: Number(avgResult[0].total_ratings),
  };
};

const getMechanicRatingData = async (mechanic_id: string) => {
  const ratings = await db.query.RatingByUser.findMany({
    where: eq(RatingByUser.mechanic_id, mechanic_id),
    columns: { created_at: true, rating: true, text: true },
    with: {
      user: {
        columns: {
          full_name: true,
          mobile: true,
          image: true,
          user_id: true,
        },
      },
    },
  });

  const avgResult = await Repository.getAvgRatingOfAMechanic(mechanic_id);

  return {
    ratings,
    avg_rating: Number(Number(avgResult[0].avg_rating).toFixed(1)),
    total: Number(avgResult[0].total_ratings),
  };
};

export const RatingRepository = {
  ratingGivenByMechanic,
  getUserRatingData,
  getMechanicRatingData,
  ratingGivenByUser,
};
