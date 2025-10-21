import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { UserServiceController } from "../controller/user_service.controller";

const router = Router();

router.post(
  "/make_service_req",
  auth(["user"]),
  UserServiceController.makeServiceReq
);
router.get(
  "/get_running_service",
  auth(["user"]),
  UserServiceController.getRunningProgress
);

router.get(
  "/get_available_service_for_bid",
  auth(["mechanic"]),
  UserServiceController.getAvailableServicesForMechanic
);

export const ServiceRoute = router;
