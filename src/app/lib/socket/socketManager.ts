import { Server, Socket } from "socket.io";
import { disconnectHandler } from "./handler/disconnectHandler";

export const registerSocketHandlers = (io: Server, socket: Socket) => {
  disconnectHandler(io, socket);
};
