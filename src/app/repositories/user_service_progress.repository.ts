import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ServiceProgress } from "../db/schema/service_flow/progress/service_progress.schema";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

const updateServiceProgress = async (
  data: Partial<typeof ServiceProgress.$inferInsert>,
  service_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [updated_data] = await client
    .update(ServiceProgress)
    .set(data)
    .where(eq(ServiceProgress.service_id, service_id))
    .returning();

  return updated_data;
};

const findServiceProgressData = async (s_id: string) => {
  const data = await db.query.ServiceProgress.findFirst({
    where: eq(ServiceProgress.service_id, s_id),
    with: { bid_data: { columns: { price: true } } },
  });
  return data;
};

export const ServiceProgressRepository = {
  updateServiceProgress,
  findServiceProgressData,
};
