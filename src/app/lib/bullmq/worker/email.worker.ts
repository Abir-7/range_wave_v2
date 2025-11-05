import { Worker, Job } from "bullmq";
import { connection } from "..";
import { EmailJobData } from "../queues/email.queue";
import { handleEmailJob } from "../jobs/email.handler";

export const emailWorker = new Worker<EmailJobData>(
  "emailQueue",
  async (job: Job<EmailJobData>) => {
    console.log(`👷 Processing job ${job.id}`);
    await handleEmailJob(job.data);
  },
  { connection: connection }
);

emailWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
