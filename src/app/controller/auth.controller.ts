import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { AppError } from "../utils/serverTools/AppError";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password, role, profile } = req.body;

  if (!email || !password || !profile || !role) {
    throw new AppError(
      "Email, password, role, and profile data are required",
      400
    );
  }

  const result = await AuthService.registerUser(
    { email, password, role },
    profile
  );

  sendResponse(res, {
    success: true,
    message: "User created successfully",
    status_code: 200,
    data: result,
  });
});

const verifyUser = catchAsync(async (req: Request, res: Response) => {
  const { user_id, code } = req.body;

  const result = await AuthService.verifyUser(user_id, code);

  sendResponse(res, {
    success: true,
    message: "User successfully verified.",
    status_code: 200,
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.userLogin(req.body);

  sendResponse(res, {
    success: true,
    message: "User successfully login.",
    status_code: 200,
    data: result,
  });
});

const resendCode = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resendCode(req.body.user_id);

  sendResponse(res, {
    success: true,
    message: "Code successfully resend.",
    status_code: 200,
    data: result,
  });
});

const reqForgotPassword = catchAsync(async (req: Request, res: Response) => {
  const createdUser = await AuthService.forgotPassword(req.body.email);

  sendResponse(res, {
    success: true,
    message: "A code has been sent to your email.",
    status_code: 200,
    data: createdUser,
  });
});

const verifyForgotPasswordReq = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.verifyForgotPasswordReq(
      req.body.user_id,
      req.body.code
    );

    sendResponse(res, {
      success: true,
      message: "Verification successfull.",
      status_code: 200,
      data: result,
    });
  }
);

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const result = await AuthService.resetPassword(token, req.body);

  sendResponse(res, {
    success: true,
    message: "Password successfully reset.",
    status_code: 200,
    data: result,
  });
});
const updatePassword = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user);
  const result = await AuthService.updatePassword(req.user.user_id, req.body);

  sendResponse(res, {
    success: true,
    message: "Password successfully updated.",
    status_code: 200,
    data: result,
  });
});
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user);
  const result = await AuthService.getNewAccessToken(req.body.token);

  sendResponse(res, {
    success: true,
    message: "New access token created successfully.",
    status_code: 200,
    data: result,
  });
});

export const AuthController = {
  createUser,
  verifyUser,
  userLogin,
  resendCode,
  reqForgotPassword,
  verifyForgotPasswordReq,
  resetPassword,
  updatePassword,
  getNewAccessToken,
};
