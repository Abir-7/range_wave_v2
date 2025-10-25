import { stripe } from "../config/stripe";

const toStripeAmount = (usd: number) => Math.round(usd * 100);

const createPaymentIntentForMechanic = async (
  amountInUsd: number,
  meta_data: {
    type: "conflict" | "other";
    mechanic_id: string;
  },
  currency: string = "usd"
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: toStripeAmount(amountInUsd),
    currency,
    metadata: meta_data,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};

const createPaymentIntentForUser = async (
  amountInUsd: number,
  meta_data: {
    type: "service_complete" | "other";
    user_id: string;
    service_progress_id: string;
  },
  currency: string = "usd"
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: toStripeAmount(amountInUsd),
    currency,
    metadata: meta_data,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
};

export const StripeRepository = {
  createPaymentIntentForMechanic,
  createPaymentIntentForUser,
};
