import redis from "../../radis";

export const getSocketsByUser = async (user_id: string) => {
  return await redis.smembers(`user:${user_id}`);
};
