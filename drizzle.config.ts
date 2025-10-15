import { appConfig } from "./src/app/config/appConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: ["./src/app/db/schema/user"],
  dbCredentials: {
    url: appConfig.database.dataBase_uri as string,
  },
});
