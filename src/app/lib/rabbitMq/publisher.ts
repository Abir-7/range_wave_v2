/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getChannel } from ".";
import { logger } from "../../utils/serverTools/logger";

export const publishJob = async (queueName: string, payload: object) => {
  try {
    const channel = await getChannel(queueName);
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
    logger.info(`Job published to ${queueName}`);
  } catch (error: any) {
    logger.error(`Failed to publish job to ${queueName}: ${error.message}`);
    throw error;
  }
};
