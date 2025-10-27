import { Server, Socket } from "socket.io";
import redis from "../../radis";

export const roomHandler = (io: Server, socket: Socket) => {
  // Join a one-to-one chat room
  socket.on("room:join", async ({ room_id }) => {
    socket.join(`room:${room_id}`);
    console.log(`User ${socket.data.user_id} joined room ${room_id}`);

    // Clear unread messages when joining
    await redis.del(`unread:${room_id}:${socket.data.user_id}`);
  });

  // Leave room
  socket.on("room:leave", ({ room_id }) => {
    socket.leave(`room:${room_id}`);
    console.log(`User ${socket.data.user_id} left room ${room_id}`);
  });
};
