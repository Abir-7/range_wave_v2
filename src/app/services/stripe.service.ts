import { WorkshopPaymentRepository } from "./../repositories/payment_for_workshop.repository";
import { StripeRepository } from "../repositories/stripe.repository";
import { logger } from "../utils/serverTools/logger";
import { appConfig } from "../config/appConfig";
import { stripe } from "../config/stripe";
import Stripe from "stripe";
import { db } from "../db";
import { Payments } from "../schema/payment/payment.schema";
import { PaymentRepository } from "../repositories/payment.repository";
import { ServiceProgressRepository } from "../repositories/user_service_progress.repository";
import { Repository } from "../repositories/helper.repository";
import { AppError } from "../utils/serverTools/AppError";
import { UserRepository } from "../repositories/user.repository";

const createPaymentIntentForMechanic = async (
  price: number,
  mechanic_id: string,
  type: "conflict" | "other" = "conflict"
) => {
  let data;
  try {
    if (type === "conflict") {
      // check for previous payment data
      const is_payment_done =
        await WorkshopPaymentRepository.findWorkshopPaymentByMechanicId(
          mechanic_id
        );

      if (is_payment_done && is_payment_done.status === "paid") {
        throw new Error("Payment already done.");
      }

      data = await StripeRepository.createPaymentIntentForMechanic(price, {
        mechanic_id,
        type: type,
      });

      await WorkshopPaymentRepository.savePaymentForWorkshop(
        data.id,
        mechanic_id,
        price
      );

      return { client_secret: data.client_secret };
      //return { paymentIntent: data.client_secret };
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

const createPaymentIntentForUser = async (
  payment_data: {
    service_progress_id: string;
    payment_type: string;
    total_amount: string;
    user_id: string;
    type: "other" | "service_complete";
  },
  mechanic_account_id: string,
  currency: string = "usd"
) => {
  try {
    return await Repository.transaction(async (tx) => {
      const data = await StripeRepository.createPaymentIntentForUser(
        Number(payment_data.total_amount),
        {
          service_progress_id: payment_data.service_progress_id,
          type: payment_data.type,
          user_id: payment_data.user_id,
        },
        currency,
        mechanic_account_id
      );

      const saved_data = await PaymentRepository.savePament(
        {
          service_progress_id: payment_data.service_progress_id,
          payment_type: "online",
          status: "unpaid",
          total_amount: payment_data.total_amount,
          tx_id: data.id,
        },
        tx
      );
      return {
        client_secret: data.client_secret,
        payment_id: saved_data.id,
        service_progress_id: payment_data.service_progress_id,
      };
    });
  } catch (error: any) {
    throw new Error(error);
  }
};

const checkEligibility = async (mechanic_id: string) => {
  const mechanicData = await UserRepository.getMechanicsPaymentData(
    mechanic_id
  );

  if (!mechanicData || !mechanicData.account_id) {
    return { eligible: false, reason: "No connected Stripe account" };
  }

  const stripe_data = await StripeRepository.checkEligibility(
    mechanicData.account_id
  );

  if (stripe_data.eligible) {
    await UserRepository.updateMechanicPaymentData(
      { is_active: true },
      mechanic_id
    );
  }
  return stripe_data;
};

const getMechanicStripeDashboardLink = async (mechanic_id: string) => {
  const mechanicData = await UserRepository.getMechanicsPaymentData(
    mechanic_id
  );

  if (!mechanicData || !mechanicData.account_id) {
    return { eligible: false, reason: "No connected Stripe account" };
  }

  return await StripeRepository.getMechanicStripeDashboardLink(
    mechanicData.account_id
  );
};

const stripeWebhook = async (rawBody: Buffer, sig: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      appConfig.stripe.webhook as string
    );
  } catch (err) {
    logger.error(`Webhook signature verification failed:${err}`);
    logger.error("Webhook signature verification failed.");
    return;
  }
  logger.info(event.type);

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata;

      if (metadata.type === "conflict") {
        const tx_id = paymentIntent.id;
        const mechanic_id = metadata.mechanic_id;

        await WorkshopPaymentRepository.updatePaymentForWorkshop(
          tx_id,
          mechanic_id
        );
      }

      if (metadata.type === "service_complete") {
        const tx_id = paymentIntent.id;
        const service_progress_id = metadata.service_progress_id;
        await PaymentRepository.updatePamentStatus(
          {
            tx_id,
            service_progress_id,
          },
          "paid"
        );
        await ServiceProgressRepository.updateServiceProgress(
          { service_status: "COMPLETED" },
          null,
          service_progress_id
        );
      }

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata;
      if (metadata.type === "conflict") {
        const tx_id = paymentIntent.id;
        const mechanic_id = metadata.mechanic_id;

        await WorkshopPaymentRepository.deletePaymentForWorkshop(
          tx_id,
          mechanic_id
        );
      }

      if (metadata.type === "service_complete") {
        const tx_id = paymentIntent.id;
        const service_progress_id = metadata.service_progress_id;

        await PaymentRepository.updatePamentStatus(
          {
            tx_id,
            service_progress_id,
          },
          "failed"
        );
        await ServiceProgressRepository.updateServiceProgress(
          { service_status: "NEED_TO_PAY" },
          null,
          service_progress_id
        );
      }
      break;
    }
    // case "account.updated": {
    //   const account = event.data.object as Stripe.Account;

    //   const payoutsEnabled = account.payouts_enabled;
    //   const chargesEnabled = account.charges_enabled;
    //   const requirements = account.requirements;

    //   if (chargesEnabled && payoutsEnabled) {
    //     logger.info("Account activated.");
    //   }
    //   break;
    // }

    // case "": {
    //   logger.info("Account activated. 2nd");
    // }
  }
};

export const StripeService = {
  createPaymentIntentForMechanic,
  createPaymentIntentForUser,
  stripeWebhook,
  getMechanicStripeDashboardLink,
  checkEligibility,
};
