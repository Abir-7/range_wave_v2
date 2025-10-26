import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { BidController } from "../controller/bid.controller";

const router = Router();
router.post("/add_bid", auth(["mechanic"]), BidController.makeBid);
router.get(
  "/get_mechanics_bid_history",
  auth(["mechanic"]),
  BidController.getMechanicBidHistory
);
router.get(
  "/get_bid_list_of_a_service/:s_id",
  auth(["user"]),
  BidController.getBidListOfaService
);

router.get(
  "/see_bid_details/:b_id",
  auth(["user"]),
  BidController.getBidDetails
);
export const BidRoute = router;
