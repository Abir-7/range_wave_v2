import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { RatingController } from "../controller/rating.controller";

const router = Router();

router.post(
  "/give_rating_to_user",
  auth(["mechanic"]),
  RatingController.ratingGivenByMechanic
);
router.post(
  "/give_rating_to_mechanic",
  auth(["user"]),
  RatingController.ratingGivenByUser
);
router.get(
  "/get_rating_data_of_a_user/:user_id",
  auth(["mechanic"]),
  RatingController.getUserRatingData
);
router.get(
  "/get_rating_data_of_a_mechanic/:mechanic_id",
  auth(["user"]),
  RatingController.getMechanicRatingData
);

export const RatingRoute = router;
