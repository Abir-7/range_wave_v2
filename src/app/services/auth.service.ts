import { AppError } from "../utils/serverTools/AppError";
import getHashedPassword from "../utils/helper/getHashedPassword";

import { Repository } from "../repositories/helper.repository";
import {
  IAuthData,
  IDecodedData,
  TUserRole,
} from "../middleware/auth/auth.interface";
import getOtp from "../utils/helper/getOtp";
import getExpiryTime from "../utils/helper/getExpiryTime";

import isExpired from "../utils/helper/isExpired";
import { UserRepository } from "../repositories/user.repository";
import { logger } from "../utils/serverTools/logger";
import { validateUserStatus } from "../utils/helper/validateUserStatus";

import { jsonWebToken } from "../utils/jwt/jwt";
import { appConfig } from "../config/appConfig";
import { getRemainingMinutes } from "../utils/helper/getRemainingMitutes";
import comparePassword from "../utils/helper/comparePassword";
import { AuthRepository } from "../repositories/auth.repository";
import { emailQueue } from "../lib/bullmq/queues/email.queue";

const registerUser = async (
  userData: { email: string; password: string; role: TUserRole },
  profileData: {
    full_name: string;
    user_name?: string;
    mobile?: string;
    address?: string;
    gender?: "male" | "female" | "other";
    image?: string;
  }
) => {
  const user_email = userData.email.toLowerCase().trim();

  const existing = await UserRepository.findByEmail(user_email);

  if (existing?.is_verified) {
    throw new Error("User already exists with this email.");
  }

  if (
    existing &&
    (!existing.is_verified ||
      ["deleted", "pending_verification"].includes(existing.status))
  ) {
    await UserRepository.deleteUser(existing.id);
  }

  const password_hash = await getHashedPassword(userData.password);
  const otp = getOtp(4).toString();
  const expire_time = getExpiryTime(10);

  try {
    const { user } = await Repository.transaction(async (trx) => {
      const user = await AuthRepository.createUser(
        {
          email: user_email,
          password_hash,
          role: userData.role,
          is_verified: false,
          status: "pending_verification",
        },
        trx
      );

      await AuthRepository.createProfile(
        { ...profileData, user_id: user.id },
        trx
      );

      await AuthRepository.createAuthentication(
        {
          user_id: user.id,
          otp,
          expire_time,
          verification_type: "email",
        },
        trx
      );

      if (userData.role === "mechanic") {
        await AuthRepository.createWorkshop({ user_id: user.id }, trx);
        await AuthRepository.createMechanicPaymentInfo(
          { user_id: user.id },
          trx
        );
      }

      // if (userData.role === "user") {
      //   await AuthRepository.createUserCarinfo({ user_id: user.id }, trx);
      // }

      await AuthRepository.createUserLocationinfo({ user_id: user.id }, trx);

      return { user };
    });
    // publishJob("emailQueue", {
    //   to: user.email,
    //   subject: "Verification",
    //   code: otp,
    //   project_name: "WrenchWave",
    //   expire_time: "10 min",
    //   purpose: "Verify your email",
    // });

    await emailQueue.add("sendEmail", {
      to: user.email,
      subject: "Verification",
      code: otp,
      project_name: "WrenchWave",
      expire_time: 10,
      purpose: "Verify your email",
      body: "",
    });

    return { id: user.id, email: user.email };
  } catch (err: any) {
    throw new Error(err?.message || "Registration failed");
  }
};

const verifyUser = async (user_id: string, code: string) => {
  const getAuthenticationData =
    await AuthRepository.getAuthenticationByUserIdAndCode(user_id, code);

  if (!getAuthenticationData) {
    throw new AppError("Code not matched. Try again.", 404);
  }

  if (getAuthenticationData.is_success) {
    throw new AppError("You already use this code successfully.", 400);
  }

  if (isExpired(getAuthenticationData.expire_time)) {
    throw new AppError("Time expired. Try resend code.", 400);
  }

  try {
    const { updated_data: updated_user, updated_auth } =
      await Repository.transaction(async (trx) => {
        const updated_data = await UserRepository.updateUser(
          user_id,
          { is_verified: true, status: "active" },
          trx
        );

        if (!updated_data.is_verified) {
          throw new AppError("Failed to verify user. Try again.", 400);
        }

        const updated_auth = await AuthRepository.setAuthenticationSuccess(
          getAuthenticationData.id,
          true,
          trx
        );

        if (!updated_auth.is_success) {
          throw new AppError("Failed to verify user. Try again.", 400);
        }

        return { updated_data, updated_auth };
      });
    const jwt_payload = {
      user_email: updated_user.email,
      user_id: updated_user.id,
      user_role: updated_user.role,
    } as IAuthData;

    const access_token = jsonWebToken.generateToken(
      jwt_payload,
      appConfig.jwt.jwt_access_secret as string,
      appConfig.jwt.jwt_access_exprire
    );
    const refress_token = jsonWebToken.generateToken(
      jwt_payload,
      appConfig.jwt.jwt_refresh_secret as string,
      appConfig.jwt.jwt_refresh_exprire
    );
    const decoded_access_token = jsonWebToken.decodeToken(access_token);
    const decoded_refresh_token = jsonWebToken.decodeToken(refress_token);

    return {
      access_token,
      refress_token,
      user_id: updated_user.id,
      access_token_expire: decoded_access_token.exp,
      refresh_token_expire: decoded_refresh_token.exp,
      user_role: decoded_access_token.user_role,
    };
  } catch (error) {
    throw error;
  }
};

const userLogin = async (data: {
  email: string;
  password: string;
  role: TUserRole;
}) => {
  if (!data.role) {
    logger.info("No action take for role. Role has no value");
  }

  const user_data = await UserRepository.findByEmail(
    data.email.toLowerCase().trim()
  );

  if (!user_data) {
    throw new AppError("Account not found. Please check your email", 404);
  }
  if (!user_data.is_verified) {
    throw new AppError("Account is not verified.", 400);
  }
  if (user_data.role !== data.role) {
    logger.info("No action take for mismatch. role not matched");
  }
  validateUserStatus(user_data.status);
  if (!(await comparePassword(data.password, user_data.password_hash))) {
    throw new AppError("Password not matched.");
  }

  const jwt_payload = {
    user_email: user_data.email,
    user_id: user_data.id,
    user_role: user_data.role,
  } as IAuthData;

  const access_token = jsonWebToken.generateToken(
    jwt_payload,
    appConfig.jwt.jwt_access_secret as string,
    appConfig.jwt.jwt_access_exprire
  );
  const refress_token = jsonWebToken.generateToken(
    jwt_payload,
    appConfig.jwt.jwt_refresh_secret as string,
    appConfig.jwt.jwt_refresh_exprire
  );
  const decoded_access_token = jsonWebToken.decodeToken(access_token);
  const decoded_refresh_token = jsonWebToken.decodeToken(refress_token);

  return {
    access_token,
    refress_token,
    user_id: user_data.id,
    access_token_expire: decoded_access_token.exp,
    refresh_token_expire: decoded_refresh_token.exp,
    user_role: decoded_access_token.user_role,
    is_profile_updated: user_data.profile.is_profile_completed,
  };
};

const resendCode = async (user_id: string) => {
  const user_data = await UserRepository.findById(user_id);

  if (!user_data) {
    throw new AppError("Account not found.", 404);
  }

  const latest_auth = await AuthRepository.getAuthenticationByUserId(user_id);

  if (latest_auth && !isExpired(latest_auth.expire_time)) {
    const remain = getRemainingMinutes(latest_auth.expire_time);
    throw new AppError(
      `You can request for code again after ${remain} minutes`,
      404
    );
  }

  const code = String(getOtp(4));
  const expire_time = getExpiryTime(10);

  await AuthRepository.createAuthentication({
    otp: code,
    expire_time,
    user_id,
    is_success: false,
    verification_type: "resend",
  });

  // await publishJob("emailQueue", {
  //   to: user_data.email,
  //   subject: "Resend",
  //   code: code,
  //   project_name: "WrenchWave",
  //   expire_time: "10 min",
  //   purpose: "verify",
  // });

  await emailQueue.add("sendEmail", {
    to: user_data.email,
    subject: "Verification",
    code: code,
    project_name: "WrenchWave",
    expire_time: 10,
    purpose: "Verify your email",
    body: "",
  });
};

const forgotPassword = async (user_email: string) => {
  const user_data = await UserRepository.findByEmail(user_email?.toLowerCase());

  if (!user_data) {
    throw new AppError("Account not found.", 404);
  }

  const code = String(getOtp(4));
  const expire_time = getExpiryTime(10);

  await AuthRepository.createAuthentication({
    otp: code,
    expire_time,
    user_id: user_data.id,
    is_success: false,
    verification_type: "forgot-password",
  });

  // await publishJob("emailQueue", {
  //   to: user_data.email,
  //   subject: "Forgot Password",
  //   code: code,
  //   project_name: "WrenchWave",
  //   expire_time: "10 min",
  //   purpose: "verify",
  // });

  await emailQueue.add("sendEmail", {
    to: user_data.email,
    subject: "Verification",
    code: code,
    project_name: "WrenchWave",
    expire_time: 10,
    purpose: "Verify your email",
    body: "",
  });

  return {
    message: "A code has been sent to your email.",
    user_id: user_data.id,
  };
};

const verifyForgotPasswordReq = async (user_id: string, code: string) => {
  const user_data = await UserRepository.findById(user_id);

  if (!user_data) {
    throw new AppError("Account not found.", 404);
  }

  const getAuthenticationData =
    await AuthRepository.getAuthenticationByUserIdAndCode(user_id, code);

  if (!getAuthenticationData) {
    throw new AppError("Code not matched. Try again.", 404);
  }

  if (getAuthenticationData.is_success) {
    throw new AppError("You already use this code successfully.", 400);
  }

  if (isExpired(getAuthenticationData.expire_time)) {
    throw new AppError("Time expired. Try resend code.", 400);
  }

  const expire_time = getExpiryTime(10);

  const jwt_payload = {
    user_email: user_data.email,
    user_id: user_data.id,
    user_role: user_data.role,
  } as IAuthData;

  const access_toekn = jsonWebToken.generateToken(
    jwt_payload,
    appConfig.jwt.jwt_access_secret as string,
    appConfig.jwt.jwt_access_exprire
  );

  try {
    await Repository.transaction(async (trx) => {
      const updated_data = await UserRepository.updateUser(
        user_id,
        { need_to_reset_password: true },
        trx
      );

      if (!updated_data.need_to_reset_password) {
        throw new AppError(
          "Failed to verify password reset request. Try again.",
          400
        );
      }

      const updated_auth = await AuthRepository.setAuthenticationSuccess(
        getAuthenticationData.id,
        true,
        trx
      );

      if (!updated_auth.is_success) {
        throw new AppError(
          "Failed to verify password reset request. Try again.",
          400
        );
      }

      await AuthRepository.createAuthentication({
        expire_time,
        user_id: user_id,
        is_success: false,
        token: access_toekn,
        verification_type: "token",
      });
    });

    return { token: access_toekn };
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (
  token: string,
  password_data: {
    new_password: string;
    confirm_password: string;
  }
) => {
  let decoded_data: IDecodedData;
  try {
    decoded_data = jsonWebToken.decodeToken(token);
  } catch (error) {
    throw new AppError("Failed to update password.", 500);
  }

  if (decoded_data && !decoded_data.user_id) {
    throw new AppError("Failed to update password.", 500);
  }

  const user_data = await UserRepository.findById(decoded_data.user_id);

  const user_auth_data = await AuthRepository.getAuthenticationByUserIdAndToken(
    decoded_data.user_id,
    token
  );

  if (!user_data) {
    throw new AppError("Failed to update password.", 500);
  }
  if (!user_data.need_to_reset_password) {
    throw new AppError("Failed to update password.", 500);
  }

  if (!user_auth_data) {
    throw new AppError("Failed to update password.", 500);
  }

  if (password_data.confirm_password !== password_data.new_password) {
    throw new AppError("Password and Confirm password not matched", 500);
  }

  const hashed_password = await getHashedPassword(password_data.new_password);

  try {
    return await Repository.transaction(async (trx) => {
      await AuthRepository.setAuthenticationSuccess(
        user_auth_data.id,
        true,
        trx
      );
      await UserRepository.updateUser(
        user_data.id,
        {
          need_to_reset_password: false,
          password_hash: hashed_password,
          updated_at: new Date(),
        },
        trx
      );
      return { message: "Password reset successfully." };
    });
  } catch (error) {
    throw new AppError("Failed to update password.", 400);
  }
};

const updatePassword = async (
  user_id: string,
  password_data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }
) => {
  const user_data = await UserRepository.findById(user_id);

  if (!user_data) {
    throw new AppError("Account not found.");
  }

  if (
    !(await comparePassword(
      password_data.old_password,
      user_data.password_hash
    ))
  ) {
    throw new AppError("Old password not matched.");
  }
  if (password_data.confirm_password !== password_data.new_password) {
    throw new AppError("New password and confirm password not matched.");
  }

  const hashed_password = await getHashedPassword(password_data.new_password);
  await UserRepository.updateUser(user_id, {
    password_hash: hashed_password,
    updated_at: new Date(),
  });

  return { message: "Password updated successfully" };
};

const getNewAccessToken = async (token: string) => {
  try {
    const decoded_data = jsonWebToken.verifyJwt(
      token,
      appConfig.jwt.jwt_refresh_secret as string
    );
    if (!decoded_data.user_id) {
      throw new AppError("Please login again.");
    }

    const user_data = await UserRepository.findById(decoded_data.user_id);

    if (!user_data) {
      throw new AppError("Please login again.");
    }

    const payload: IAuthData = {
      user_email: user_data.email,
      user_id: user_data.id,
      user_role: user_data.role,
    };

    const access_token = jsonWebToken.generateToken(
      payload,
      appConfig.jwt.jwt_access_secret as string,
      appConfig.jwt.jwt_access_exprire
    );

    const decoded_access_token = jsonWebToken.decodeToken(access_token);
    return {
      access_token,
      access_token_expire: decoded_access_token.exp,
    };
  } catch (error) {
    throw new AppError("Please login again.");
  }
};

export const AuthService = {
  registerUser,
  verifyUser,
  userLogin,
  resendCode,
  forgotPassword,
  verifyForgotPasswordReq,
  resetPassword,
  updatePassword,
  getNewAccessToken,
};
