import { UserController } from "../controller/user.controller";
import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { upload } from "../middleware/multer/multer";
import { parseDataField } from "../middleware/parseData";

const router = Router();
router.patch(
  "/update_workshop",
  auth(["mechanic"]),
  UserController.updateMechanicsWorkshopData
);
router.patch(
  "/update_car_info",
  auth(["user"]),
  UserController.updateUserCarData
);

router.patch(
  "/update_user_profile",
  auth(["user", "mechanic"]),
  upload.single("image"),
  parseDataField("data"),
  UserController.updateUserProfile
);

router.get(
  "/connect_stripe_account",
  auth(["mechanic"]),
  UserController.createAndConnectStripeAccount
);

router.get(
  "/get_mechanic_earning_data",
  auth(["mechanic"]),
  UserController.getMechanicsEarningData
);

export const UserRoute = router;
