import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Payments } from "../db/schema/payment/payment.schema";
import { db, schema } from "../db";

const savePament = async (
  data: typeof Payments.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [saved_payment] = await client
    .insert(Payments)
    .values(data)
    .returning();
  return saved_payment;
};

const getPaymentByServiceProgresId = async (sp_id: string) => {
  const saved_payment = await db.query.Payments.findFirst({
    where: eq(Payments.service_progress_id, sp_id),
  });
  return saved_payment;
};

export const PaymentRepository = { savePament, getPaymentByServiceProgresId };
