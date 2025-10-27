import Redis from "ioredis";
import { appConfig } from "../../config/appConfig";

const redis = new Redis({
  host: appConfig.radis.host as string, // "127.0.0.1",
  port: Number(appConfig.radis.port),
  // password: process.env.REDIS_PASSWORD, // if needed
});

export default redis;
