import { TUserStatus } from "../../middleware/auth/auth.interface";
import { AppError } from "../serverTools/AppError";

export const validateUserStatus = (status: TUserStatus): boolean => {
  switch (status) {
    case "active":
      return true;

    case "pending_verification":
      throw new AppError(
        "Account is not verified. Please verify your email.",
        403
      );

    case "blocked":
      throw new AppError(
        "Your account is blocked. Please contact support.",
        403
      );

    case "disabled":
      throw new AppError("Your account is disabled by the administrator.", 403);

    case "deleted":
      throw new AppError("This account has been deleted.", 403);

    default:
      throw new AppError("Unknown account status.", 500);
  }
};
