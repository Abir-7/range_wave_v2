import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { UserServiceController } from "../controller/user_service.controller";
import { validator } from "../middleware/validator";
import { ZodIssueSchema } from "../dtos/user_service.dto";

const router = Router();

router.post(
  "/make_service_req",
  auth(["user"]),
  validator(ZodIssueSchema),
  UserServiceController.makeServiceReq
);

router.get(
  "/get_available_service_for_bid",
  auth(["mechanic"]),
  UserServiceController.getAvailableServicesForMechanic
);

router.get(
  "/get_single_running_service",
  auth(["user", "mechanic"]),
  UserServiceController.getLatestRunningService
);
router.get(
  "/get_running_service_details/:s_id",
  auth(["user", "mechanic"]),
  UserServiceController.getRunningServiceDetails
);
router.get(
  "/get_service_details/:s_id",
  auth(["mechanic"]),
  UserServiceController.getServiceDetails
);
router.patch(
  "/cancel_service/:s_id",
  auth(["mechanic"]),
  UserServiceController.cancelService
);
export const ServiceRoute = router;
