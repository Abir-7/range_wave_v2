import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { BidController } from "../controller/bid.contoller";

const router = Router();
router.post("/add_bid", auth(["mechanic"]), BidController.makeBid);
router.get(
  "/get_mechanics_bid_history",
  auth(["mechanic"]),
  BidController.getMechanicBidHistory
);
export const BidRoute = router;
