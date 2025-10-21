import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db, schema } from "../db";
import { Services } from "../db/schema/service_flow/service/service.schema";
import { ServiceProgress } from "../db/schema/service_flow/progress/service_progress.schema";
import { and, desc, eq, inArray, notExists } from "drizzle-orm";
import { Bids } from "../db/schema/service_flow/bid/bid.schema";

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
    .select({ service: Services })
    .from(Services)
    .innerJoin(ServiceProgress, eq(ServiceProgress.service_id, Services.id))
    .where(
      and(
        eq(ServiceProgress.service_status, "FINDING"),
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
    );
  console.log(data);
  return data;
};

export const ServiceRepository = {
  makeServiceReq,
  makeServiceProgres,
  getRunningProgress,
  getAvailableServicesForMechanic,
};
