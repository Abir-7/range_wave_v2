"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserStatus = void 0;
const AppError_1 = require("../serverTools/AppError");
const validateUserStatus = (status) => {
    switch (status) {
        case "active":
            return true;
        case "pending_verification":
            throw new AppError_1.AppError("Account is not verified. Please verify your email.", 403);
        case "blocked":
            throw new AppError_1.AppError("Your account is blocked. Please contact support.", 403);
        case "disabled":
            throw new AppError_1.AppError("Your account is disabled by the administrator.", 403);
        case "deleted":
            throw new AppError_1.AppError("This account has been deleted.", 403);
        default:
            throw new AppError_1.AppError("Unknown account status.", 500);
    }
};
exports.validateUserStatus = validateUserStatus;
