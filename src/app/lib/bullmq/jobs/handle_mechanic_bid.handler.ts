import { BidRepository } from "../../../repositories/bid.repository";

import { MechanicBidJobData } from "../queues/handle_mechanic_bid.queue";

export async function handleMechanicBid(
  data: MechanicBidJobData
): Promise<void> {
  await BidRepository.handleMechanicBidStatus(data.bid_id);
}
