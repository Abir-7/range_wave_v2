import { text } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "../db/helper/columns.helpers";
import { numeric } from "drizzle-orm/pg-core";
import { paymentStatusEnum } from "./payment.schema";
import { MechanicWorkshop } from "./mechanics_workshop.schema";

export const Payments_for_workshop = pgTable("payments_for_workshop", {
  id: uuid("id").defaultRandom().primaryKey(),
  tx_id: text("tx_id").unique(),
  mechanic_id: uuid("mechanic_id")
    .notNull()
    .unique()
    .references(() => MechanicWorkshop.user_id, { onDelete: "cascade" }),
  total_amount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull(),
  ...timestamps,
});
