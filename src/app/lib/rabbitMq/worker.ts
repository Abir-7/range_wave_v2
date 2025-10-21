import { consumeQueue } from "./consumer";
import { sendEmail } from "../../utils/sendEmail";
import { logger } from "../../utils/serverTools/logger";

export const startConsumers = async () => {
  await consumeQueue("emailQueue", async (job) => {
    console.log("Raw job JSON string:", JSON.stringify(job, null, 2));
    const { to, subject, code, project_name, expire_time, purpose } = job;
    logger.info(`${code}----`);
    try {
      logger.info(`Processing email job: ${to}, ${subject}`);

      await sendEmail({
        to,
        subject,
        code,
        project_name,
        expire_time,
        purpose,
      });
    } catch (error) {
      logger.error("Error processing email job:", error);
    }
  });
};
