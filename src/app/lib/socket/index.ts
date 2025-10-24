import http from "http";
import { Server, Socket } from "socket.io";
import redis from "../radis";
import { appConfig } from "../../config/appConfig";
import { jsonWebToken } from "../../utils/jwt/jwt";
import { logger } from "../../utils/serverTools/logger";
import { registerSocketHandlers } from "./socketManager";

let io: Server;

const JWT_SECRET = appConfig.jwt.jwt_access_secret;

export const initSocket = (server: http.Server) => {
  io = new Server(server, { cors: { origin: "*" } });

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
    logger.info(`✅ User connected: ${socket.data.user_id}`);
    registerSocketHandlers(io, socket);
  });

  return io;
};

export const getSocket = (): Server => {
  if (!io) throw new Error("Socket.IO not initialized yet.");
  return io;
};
