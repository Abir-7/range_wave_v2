import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db, schema } from "../db";

const transaction = async <T>(
  callback: (tx: NodePgDatabase<typeof schema>) => Promise<T>
): Promise<T> => {
  return await db.transaction(async (tx) => {
    return await callback(tx);
  });
};

export const Repository = {
  transaction,
};
