import http from "http";
import { Server, Socket } from "socket.io";

import { appConfig } from "../../config/appConfig";
import { jsonWebToken } from "../../utils/jwt/jwt";

import redis from "../radis";
import { logger } from "../../utils/serverTools/logger";

let io: Server;

const JWT_SECRET = appConfig.jwt.jwt_access_secret;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  logger.info("Socket.IO initialized with auth");

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("No token provided");

      const payload = jsonWebToken.verifyJwt(token, JWT_SECRET as string);

      socket.data.user_id = payload.user_id;

      await redis.sadd(`user:${payload.user_id}`, socket.id);

      next();
    } catch (err: any) {
      logger.error("❌ Socket auth failed:", err.message);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    logger.info(
      `User connected: ${socket.data.user_id} (socket: ${socket.id})`
    );

    socket.on("disconnect", async () => {
      logger.warn(`User disconnected: ${socket.data.user_id}`);

      await redis.srem(`user:${socket.data.user_id}`, socket.id);

      const remaining = await redis.scard(`user:${socket.data.user_id}`);
      if (remaining === 0) await redis.del(`user:${socket.data.user_id}`);
    });
  });

  return io;
};

export const getSocket = (): Server => {
  if (!io) throw new Error("Socket.IO not initialized yet.");
  return io;
};
