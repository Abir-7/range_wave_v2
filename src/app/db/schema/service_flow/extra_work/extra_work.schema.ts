import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Services } from "../service/service.schema";
import { Payments } from "../../payment/payment.schema";
import { numeric } from "drizzle-orm/pg-core";
import { timestamps } from "../../../helper/columns.helpers";
import { varchar } from "drizzle-orm/pg-core";

export const Bids = pgTable("bids", {
  id: uuid("id").primaryKey().defaultRandom(),

  service_id: uuid("req_service_id")
    .notNull()
    .references(() => Services.id, { onDelete: "cascade" }),

  price: numeric("price", { precision: 10, scale: 2 }).notNull(),

  issue: varchar("issue"),
  description: varchar("issue"),

  ...timestamps,
});
