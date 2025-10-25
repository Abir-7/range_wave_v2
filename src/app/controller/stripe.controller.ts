import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { StripeService } from "../services/stripe.service";
import sendResponse from "../utils/serverTools/sendResponse";
import status from "http-status";

const createPaymentIntentForMechanic = catchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeService.createPaymentIntentForMechanic(
      Number(req.body.price),
      req.user.user_id,
      req.body?.type
    );

    sendResponse(res, {
      success: true,
      message: "Secrete created successfully.",
      status_code: 200,
      data: result,
    });
  }
);

const stripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const rawBody = req.body;
  console.log(rawBody);
  const result = await StripeService.stripeWebhook(rawBody, sig);
  sendResponse(res, {
    success: true,
    status_code: status.OK,
    message: "Webhook response",
    data: result,
  });
});

export const StripeController = {
  createPaymentIntentForMechanic,
  stripeWebhook,
};
