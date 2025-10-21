import { eq } from "drizzle-orm";
import { db } from "../db";
import { Bids } from "../db/schema/service_flow/bid/bid.schema";
import { Services } from "../db/schema/service_flow/service/service.schema";

const addBid = async (data: typeof Bids.$inferInsert) => {
  const [created_bid] = await db.insert(Bids).values(data).returning();
  return created_bid;
};

const getMechanicBidHistory = async (mechanicId: string) => {
  return await db
    .select({
      service: Services,
      bid: Bids,
    })
    .from(Bids)
    .innerJoin(Services, eq(Services.id, Bids.service_id))
    .where(eq(Bids.mechanic_id, mechanicId));
};
export const BidRepository = { addBid, getMechanicBidHistory };
