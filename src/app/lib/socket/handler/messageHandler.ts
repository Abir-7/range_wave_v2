import { ChatRepository } from "./../../../repositories/chat.repository";
import { Server, Socket } from "socket.io";

import redis from "../../radis";
import { getSocketsByUser } from "../helper/getSocketsByUser";

export const messageSendHandler = (io: Server, socket: Socket) => {
  socket.on("message:send", async (data, ack) => {
    try {
      const { room_id, receiver_id, ...other } = data;
      const sender_id = socket.data.user_id;

      // 1️⃣ Create temporary message for instant UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender_id,
        room_id,
        ...other,
        created_at: new Date(),
        status: "sending",
      };

      // 2️⃣ Emit immediately to sender and room
      socket.emit("message:sent", tempMessage);
      socket.to(`room:${room_id}`).emit("message:new", tempMessage);

      // 3️⃣ Check if recipient is currently in the room
      const receiverSockets = await getSocketsByUser(receiver_id);
      let isInRoom = false;
      for (const sid of receiverSockets) {
        const socketInstance = io.sockets.sockets.get(sid);
        const rooms = socketInstance?.rooms;
        if (rooms?.has(`room:${room_id}`)) {
          isInRoom = true;
          break;
        }
      }

      // 4️⃣ Increment unread count and emit chat list update if recipient not in room
      if (!isInRoom) {
        const unread = await redis.incr(`unread:${room_id}:${receiver_id}`);

        for (const sid of receiverSockets) {
          const socketInstance = io.sockets.sockets.get(sid);
          if (!socketInstance) continue;

          socketInstance.emit("chatlist:unread_update", {
            room_id,
            unread_count: unread,
            last_message: tempMessage.message,
            last_message_time: tempMessage.created_at,
          });
        }
      }

      // 5️⃣ Save message to DB asynchronously
      const savedMessage = await ChatRepository.saveMessage(
        { sender_id, ...other },
        room_id
      );

      // 6️⃣ Emit confirmed message with DB ID
      socket.emit("message:confirmed", savedMessage);
      socket.to(`room:${room_id}`).emit("message:confirmed", savedMessage);

      ack?.({ ok: true });
    } catch (err: any) {
      ack?.({ ok: false, error: err.message });
    }
  });
};
