import http from "http";
import app from "./app";
import { appConfig } from "./app/config/appConfig";
import { logger } from "./app/utils/serverTools/logger";
import { startConsumers } from "./app/lib/rabbitMq/worker";
import { db } from "./app/db";
import redis from "./app/lib/radis";
import { initSocket } from "./app/lib/socket";
import { seedAdmin } from "./app/db/seed_admin";

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(appConfig.server.port, async () => {
  try {
    logger.info(
      `🚀 Server running in ${appConfig.server.node_env} mode on port ${appConfig.server.port}`
    );
    await db.execute("select 1").then(() => logger.info("Database connected."));
    startConsumers(); // start RabbitMQ consumers
    initSocket(server);
    await seedAdmin();
  } catch (err) {
    logger.error("Error during server startup:", err);
    process.exit(1); // exit if startup fails
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise) => {
  logger.error("UNHANDLED REJECTION! Shutting down...", reason);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...", err);
  process.exit(1);
});

//redis
redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  logger.error("Redis error:", err);
});
