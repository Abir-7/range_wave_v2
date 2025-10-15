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
      connection = await amqplib.connect(uri);
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
      return channelMap.get(queueName)!;
    }

    const channel = await connection.createChannel();
    if (queueName) {
      await channel.assertQueue(queueName, { durable: true });
      channelMap.set(queueName, channel);
    }

    return channel;
  } catch (error: any) {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
    throw error;
  }
};
