import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { ServiceProgressController } from "../controller/user_service_progress.controller";

const router = Router();

router.patch(
  "/hire_mechanic",
  auth(["user"]),
  ServiceProgressController.hireMechanic
);
router.patch(
  "/change_status/:s_id",
  auth(["mechanic"]),
  ServiceProgressController.changeServiveStatus
);

router.patch(
  "/mark_as_complete/:s_id",
  auth(["user"]),
  ServiceProgressController.markAsComplete
);
router.get(
  "/user_car_history",
  auth(["user"]),
  ServiceProgressController.getUsersCarServiceHistory
);

router.patch(
  "/add_extra_work/:s_id",
  auth(["mechanic"]),
  ServiceProgressController.addExtraWorkData
);
router.patch(
  "/accept_or_reject_extra_work/:s_id",
  auth(["user"]),
  ServiceProgressController.acceptOrRejectExtraWork
);
router.get(
  "/get_running_service_of_user_mechanic",
  auth(["user"]),
  ServiceProgressController.getAllRunningServiceProgressOfUserOrMechanic
);

export const ServiceProgressRoute = router;
