import { db } from "../db";

export type DatabaseTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];
const transaction = async <T>(
  callback: (tx: DatabaseTransaction) => Promise<T>
): Promise<T> => {
  return await db.transaction(async (tx) => {
    return await callback(tx);
  });
};

export const Repository = {
  transaction,
};
