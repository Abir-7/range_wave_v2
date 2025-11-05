import { eq } from "drizzle-orm";
import { db } from ".";

import getHashedPassword from "../utils/helper/getHashedPassword";
import { logger } from "../utils/serverTools/logger";
import { appConfig } from "../config/appConfig";
import { Users } from "../schema/user.schema";

export async function seedAdmin() {
  try {
    const email = appConfig.admin.email as string;
    const password = appConfig.admin.password as string;

    const existing = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email));

    if (existing) {
      console.log("Admin already exists");
      return;
    }

    const password_hash = await getHashedPassword(password);

    await db
      .insert(Users)
      .values({
        email,
        password_hash,
        role: "super_admin",
        is_verified: true,
        status: "active",
      })
      .returning();

    logger.info("Admin created:");
  } catch (err) {
    logger.error("Error seeding admin:", err);
  }
}
