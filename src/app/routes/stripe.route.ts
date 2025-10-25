import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { StripeController } from "../controller/stripe.controller";

const router = Router();

router.patch(
  "/create_payment_intent_for_mechanic",
  auth(["mechanic"]),
  StripeController.createPaymentIntentForMechanic
);

export const StripeRoute = router;
