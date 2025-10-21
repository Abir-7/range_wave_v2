/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import amqplib, { Channel } from "amqplib";
import { appConfig } from "../../config/appConfig";
import { logger } from "../../utils/serverTools/logger";

const uri = appConfig.rabbitMq.url as string;

let connection: any | null = null;
const channelMap: Map<string, Channel> = new Map();

export const getChannel = async (queueName?: string): Promise<Channel> => {
  try {
    if (!connection) {
      logger.info(`Connecting to RabbitMQ at ${uri}...`);
      connection = await amqplib.connect(uri);
      logger.info("RabbitMQ connection established");

      connection.on("error", (err: unknown) => {
        logger.error("RabbitMQ connection error:", err);
        connection = null;
      });

      connection.on("close", () => {
        logger.warn("RabbitMQ connection closed");
        connection = null;
      });
    }

    if (queueName && channelMap.has(queueName)) {
      const cachedChannel = channelMap.get(queueName)!;
      if (cachedChannel.connection) return cachedChannel;
      channelMap.delete(queueName); // stale channel
    }

    const channel = await connection.createChannel();
    logger.info(`Channel created${queueName ? " for " + queueName : ""}`);

    if (queueName) {
      await channel.assertQueue(queueName, { durable: true });
      channelMap.set(queueName, channel);

      channel.on("error", (err: unknown) => {
        logger.error(`Channel error for ${queueName}:`, err);
        channelMap.delete(queueName);
      });

      channel.on("close", () => {
        logger.warn(`Channel closed for ${queueName}`);
        channelMap.delete(queueName);
      });
    }

    return channel;
  } catch (error: any) {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
    throw error;
  }
};
