import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1", // "127.0.0.1",
  port: 6379,
  // password: process.env.REDIS_PASSWORD, // if needed
});

export default redis;
