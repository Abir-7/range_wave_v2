import IORedis from "ioredis";
import { appConfig } from "../../config/appConfig";

export const connection = new IORedis({
  host: appConfig.radis.host,
  port: Number(appConfig.radis.port),
  maxRetriesPerRequest: null,
});
