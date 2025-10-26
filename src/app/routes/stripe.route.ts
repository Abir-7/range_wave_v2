import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { StripeController } from "../controller/stripe.controller";

const router = Router();

router.patch(
  "/create_payment_intent_for_mechanic",
  auth(["mechanic"]),
  StripeController.createPaymentIntentForMechanic
);
router.get(
  "/check_eligibility",
  auth(["mechanic"]),
  StripeController.checkEligibility
);
router.get(
  "/stripe-dashboard",
  auth(["mechanic"]),
  StripeController.getMechanicStripeDashboardLink
);

export const StripeRoute = router;
