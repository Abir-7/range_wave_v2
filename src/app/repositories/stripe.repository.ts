import Stripe from "stripe";
import { appConfig } from "../config/appConfig";
import { stripe } from "../config/stripe";
import { AppError } from "../utils/serverTools/AppError";
import { UserRepository } from "./user.repository";

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

// const createPaymentIntentForUser = async (
//   amountInUsd: number,
//   meta_data: {
//     type: "service_complete" | "other";
//     user_id: string;
//     service_progress_id: string;
//   },
//   currency: string = "usd",
//   mechanic_account_id: string
// ) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: toStripeAmount(amountInUsd),
//     currency,
//     metadata: meta_data,
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   return paymentIntent;
// };

const createPaymentIntentForUser = async (
  amountInUsd: number,
  meta_data: {
    type: "service_complete" | "other";
    user_id: string;
    service_progress_id: string;
  },
  currency: string = "usd",
  mechanic_account_id: string // Connected Account ID like acct_xxx
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: toStripeAmount(amountInUsd),
    currency,
    metadata: meta_data,
    transfer_data: {
      destination: mechanic_account_id,
    },
    on_behalf_of: mechanic_account_id,
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent;
};

const createStripeConnectAccountLink = async (
  mechanicUserId: string,
  mechanicEmail: string
) => {
  const mechanicPaymentInfo = await UserRepository.getMechanicsPaymentData(
    mechanicUserId
  );

  if (!mechanicPaymentInfo) {
    throw new AppError("Mechanic not found.", 404);
  }

  const accountId =
    mechanicPaymentInfo.account_id ??
    (
      await stripe.accounts.create({
        type: "express",
        email: mechanicEmail,
        metadata: { mechanic_user_id: mechanicUserId },
      })
    ).id;

  if (!mechanicPaymentInfo.account_id) {
    await UserRepository.updateMechanicPaymentData(
      { account_id: accountId },
      mechanicUserId
    );
  }

  // 3) Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appConfig.server.base_url}/stripe/onboarding/refresh`,
    return_url: `${appConfig.server.base_url}/stripe/onboarding/success`,
    type: "account_onboarding",
  });

  return {
    account_id: accountId,
    onboarding_url: accountLink.url,
  };
};

const checkEligibility = async (account_id: string) => {
  // 2) Retrieve the Stripe account
  const stripeAccount = await stripe.accounts.retrieve(account_id);

  // 3) Check eligibility
  if (!stripeAccount.charges_enabled || !stripeAccount.payouts_enabled) {
    return {
      eligible: false,
      reason: "Stripe account not fully enabled",
      charges_enabled: stripeAccount.charges_enabled,
      payouts_enabled: stripeAccount.payouts_enabled,
      account: stripeAccount.id,
    };
  }

  // 4) Mechanic is eligible

  return {
    eligible: true,
    reason: null,
    charges_enabled: stripeAccount.charges_enabled,
    payouts_enabled: stripeAccount.payouts_enabled,
    account: stripeAccount.id,
  };
};

const getMechanicStripeDashboardLink = async (account_id: string) => {
  // 1) Retrieve the connected account
  const account = (await stripe.accounts.retrieve(
    account_id
  )) as Stripe.Account;

  if (!account) {
    throw new Error("Stripe account not found");
  }

  // 2) Create login link to Express dashboard
  const loginLink = await stripe.accounts.createLoginLink(account_id, {});

  return loginLink.url;
};
export const StripeRepository = {
  createPaymentIntentForMechanic,
  createPaymentIntentForUser,
  createStripeConnectAccountLink,
  checkEligibility,
  getMechanicStripeDashboardLink,
};
