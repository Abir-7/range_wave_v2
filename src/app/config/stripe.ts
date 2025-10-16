// src/config/stripe.ts
import Stripe from "stripe";
import { appConfig } from "./appConfig";

export const stripe = new Stripe(appConfig.stripe.secret_key!, {
  apiVersion: "2025-09-30.clover",
});
