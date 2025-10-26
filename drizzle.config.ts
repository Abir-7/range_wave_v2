import { appConfig } from "./src/app/config/appConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: [
    // "./src/app/db/schema/user",
    // "./src/app/db/schema/service_flow/bid",
    // "./src/app/db/schema/service_flow/service",
    // "./src/app/db/schema/chat/message",
    // "./src/app/db/schema/chat/room",
    "./src/app/schema/**/*.ts",
  ],
  dbCredentials: {
    url: appConfig.database.dataBase_uri as string,
  },
});
