import { Queue } from "bullmq";
import { connection } from "..";

export interface EmailJobData {
  to: string;
  subject: string;
  code: string;
  project_name: string;
  expire_time: number;
  purpose: string;
  body: string; // optional if you want
}

export const emailQueue = new Queue<EmailJobData>("emailQueue", {
  connection: connection,
});
