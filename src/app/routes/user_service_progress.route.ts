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

export const ServiceProgressRoute = router;
