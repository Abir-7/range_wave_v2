/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "../../utils/serverTools/logger";
import { getChannel } from ".";

type JobHandler = (data: any) => Promise<void>;

export const consumeQueue = async (
  queueName: string,
  handler: JobHandler,
  prefetch = 5
): Promise<void> => {
  try {
    const channel = await getChannel(queueName);
    channel.prefetch(prefetch);

    logger.info(`Waiting for messages in ${queueName}`);

    channel.consume(
      queueName,
      async (msg) => {
        if (!msg) return;

        const str = msg.content.toString();

        let data;
        try {
          data = JSON.parse(str);
        } catch (err) {
          logger.error("Failed to parse message JSON:", str);
          channel.nack(msg, false, false); // discard bad message
          return;
        }

        try {
          await handler(data);
          channel.ack(msg);
        } catch (error: any) {
          logger.error(`Error processing ${queueName}: ${error.message}`);
          channel.nack(msg, false, true);
        }
      },
      { noAck: false }
    );
  } catch (error: any) {
    logger.error(`Failed to consume queue ${queueName}: ${error.message}`);
    throw error;
  }
};
