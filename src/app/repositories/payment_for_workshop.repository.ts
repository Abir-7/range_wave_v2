import { Payments_for_workshop } from "./../db/schema/payment/payment_for_workshop";
import { db } from "../db";

import { and, eq } from "drizzle-orm";

const savePaymentForWorkshop = async (
  intentId: string,
  mechanic_id: string,
  price: number
) => {
  return await db.insert(Payments_for_workshop).values({
    tx_id: intentId, // stripe paymentIntent id
    mechanic_id,
    total_amount: price.toString(), // store in normal units ($9)
    status: "unpaid", // initial status
  });
};

const updatePaymentForWorkshop = async (tx_id: string, mechanic_id: string) => {
  return db
    .update(Payments_for_workshop)
    .set({ status: "paid" })
    .where(
      and(
        eq(Payments_for_workshop.tx_id, tx_id),
        eq(Payments_for_workshop.mechanic_id, mechanic_id)
      )
    );
};
const deletePaymentForWorkshop = async (tx_id: string, mechanic_id: string) => {
  return db
    .delete(Payments_for_workshop)
    .where(
      and(
        eq(Payments_for_workshop.tx_id, tx_id),
        eq(Payments_for_workshop.mechanic_id, mechanic_id)
      )
    );
};

const findWorkshopPaymentByMechanicId = async (mechanic_id: string) => {
  const data = await db.query.Payments_for_workshop.findFirst({
    where: eq(Payments_for_workshop.mechanic_id, mechanic_id),
  });
  return data;
};

export const WorkshopPaymentRepository = {
  savePaymentForWorkshop,
  updatePaymentForWorkshop,
  deletePaymentForWorkshop,
  findWorkshopPaymentByMechanicId,
};
