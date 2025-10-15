import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { auth } from "../middleware/auth/auth";

const router = Router();

router.post("/create-user", AuthController.createUser);
router.post("/login", AuthController.userLogin);
router.post("/resend-code", AuthController.resendCode);
router.post("/forgot-password", AuthController.reqForgotPassword);
router.post("/get-access-token", AuthController.getNewAccessToken);
router.patch("/reset-password", AuthController.resetPassword);
router.patch("/verify-user", AuthController.verifyUser);
router.patch(
  "/verify-forgot-password-req",
  AuthController.verifyForgotPasswordReq
);
router.patch("/update-password", auth(["user"]), AuthController.updatePassword);

export const AuthRoute = router;
