import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db, schema } from "../db";
import { RatingByMechanic } from "../db/schema/rating/given_by_mechanic/given_by_mechanic.schema";
import { eq, sql } from "drizzle-orm";
import { RatingByUser } from "../db/schema/rating/given_by_user/given_by_user.schema";

const transaction = async <T>(
  callback: (tx: NodePgDatabase<typeof schema>) => Promise<T>
): Promise<T> => {
  return await db.transaction(async (tx) => {
    return await callback(tx);
  });
};

const getAvgRatingOfAUser = async (user_id: string) => {
  return await db
    .select({
      avg_rating: sql<number>`COALESCE(AVG(${RatingByMechanic.rating}), 0)`.as(
        "avg_rating"
      ),
      total_ratings: sql<number>`COUNT(${RatingByMechanic.id})`.as(
        "total_ratings"
      ),
    })
    .from(RatingByMechanic)
    .where(eq(RatingByMechanic.user_id, user_id));
};

const getAvgRatingOfAMechanic = async (mechanic_id: string) => {
  return await db
    .select({
      avg_rating: sql<number>`COALESCE(AVG(${RatingByUser.rating}), 0)`.as(
        "avg_rating"
      ),
      total_ratings: sql<number>`COUNT(${RatingByUser.id})`.as("total_ratings"),
    })
    .from(RatingByUser)
    .where(eq(RatingByUser.mechanic_id, mechanic_id));
};

export const Repository = {
  transaction,
  getAvgRatingOfAUser,
  getAvgRatingOfAMechanic,
};
