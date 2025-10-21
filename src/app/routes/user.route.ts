import { UserController } from "./../controller/user.contoller";
import { Router } from "express";
import { auth } from "../middleware/auth/auth";

const router = Router();
router.patch(
  "/update_workshop",
  auth(["mechanic"]),
  UserController.updateMechanicsWorkshopData
);

export const UserRoute = router;
