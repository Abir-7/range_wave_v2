import { Queue } from "bullmq";
import { connection } from "..";

export interface MechanicBidJobData {
  bid_id: string;
}

export const mecanic_bid_queue = "mecanic_bid_queue";

export const mechanicBidQueue = new Queue<MechanicBidJobData>(
  mecanic_bid_queue,
  {
    connection: connection,
  }
);
