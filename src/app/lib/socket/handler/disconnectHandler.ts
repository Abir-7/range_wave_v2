import redis from "../../radis";

export const disconnectHandler = (io: any, socket: any) => {
  socket.on("disconnect", async () => {
    await redis.srem(`user:${socket.data.user_id}`, socket.id);

    const remaining = await redis.scard(`user:${socket.data.user_id}`);
    if (remaining === 0) await redis.del(`user:${socket.data.user_id}`);

    console.log(`❌ User disconnected: ${socket.data.user_id}`);
  });
};
