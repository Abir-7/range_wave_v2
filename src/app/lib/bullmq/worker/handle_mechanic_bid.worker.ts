import { Worker, Job } from "bullmq";
import { connection } from "..";
import {
  mecanic_bid_queue,
  MechanicBidJobData,
} from "../queues/handle_mechanic_bid.queue";
import { handleMechanicBid } from "../jobs/handle_mechanic_bid.handler";

export const mechanicBidWorker = new Worker<MechanicBidJobData>(
  mecanic_bid_queue,
  async (job: Job<MechanicBidJobData>) => {
    console.log(`👷 Processing mechanic bid job ${job.id}`);
    await handleMechanicBid(job.data);
  },
  { connection }
);

mechanicBidWorker.on("completed", (job) => {
  console.log(`🎉 Mechanic bid job ${job.id} completed`);
});

mechanicBidWorker.on("failed", (job, err) => {
  console.error(`❌ Mechanic bid job ${job?.id} failed: ${err.message}`);
});
