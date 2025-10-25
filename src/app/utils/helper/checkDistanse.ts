import { sql } from "drizzle-orm";
import { db } from "../../db";

export const checkNearbyWorkshops = async (
  coordinates: [number, number],
  mechanic_id?: string // mechanic's user_id
) => {
  const [longitude, latitude] = coordinates;

  const result = await db.execute(sql`
    SELECT *
    FROM (
      SELECT id, workshop_name, location_name, user_id,
        6371 * 2 * ASIN(
          SQRT(
            POWER(SIN(RADIANS((coordinates[2] - ${latitude})) / 2), 2) +
            COS(RADIANS(${latitude})) * COS(RADIANS(coordinates[2])) *
            POWER(SIN(RADIANS((coordinates[1] - ${longitude})) / 2), 2)
          )
        ) AS distance_km
      FROM mechanic_workshops
      WHERE coordinates[2] BETWEEN ${latitude} - 0.045 AND ${latitude} + 0.045
        AND coordinates[1] BETWEEN ${longitude} - 0.045 AND ${longitude} + 0.045
        ${mechanic_id ? sql`AND user_id != ${mechanic_id}` : sql``}
    ) AS subquery
    WHERE distance_km <= 5
    ORDER BY distance_km ASC
    LIMIT 1;
  `);

  if (result.rows.length > 0) {
    return true;
  }

  console.log("✅ No nearby workshops found");
  return false;
};
