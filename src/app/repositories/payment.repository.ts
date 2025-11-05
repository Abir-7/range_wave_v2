import { Bids } from "../schema/bid.schema";
import { status } from "http-status";
import { and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Payments } from "../schema/payment.schema";
import { db, schema } from "../db";
import { ServiceProgress } from "../schema/service_progress.schema";

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

const updatePamentStatus = async (
  data: { tx_id: string; service_progress_id: string },
  status: "paid" | "unpaid" | "failed",
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const updated_data = await client
    .update(Payments)
    .set({ status: status, updated_at: new Date() })
    .where(
      and(
        (eq(Payments.service_progress_id, data.service_progress_id),
        eq(Payments.tx_id, data.tx_id))
      )
    );
  return updated_data;
};

const getPaymentByServiceProgresId = async (sp_id: string) => {
  const saved_payment = await db.query.Payments.findFirst({
    where: eq(Payments.service_progress_id, sp_id),
  });
  return saved_payment;
};

const getMechanicsEarningData = async (mechanic_id: string) => {
  const data = await db
    .select({
      payment: Payments,
      service_progress: ServiceProgress,
      bid_data: Bids,
    })
    .from(Payments)
    .leftJoin(
      ServiceProgress,
      eq(ServiceProgress.id, Payments.service_progress_id)
    )
    .leftJoin(Bids, eq(Bids.service_id, ServiceProgress.service_id))
    .where(eq(Bids.mechanic_id, mechanic_id));

  return data;
};

export const PaymentRepository = {
  savePament,
  getPaymentByServiceProgresId,
  updatePamentStatus,
  getMechanicsEarningData,
};
