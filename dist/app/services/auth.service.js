"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const AppError_1 = require("../utils/serverTools/AppError");
const getHashedPassword_1 = __importDefault(require("../utils/helper/getHashedPassword"));
const helper_repository_1 = require("../repositories/helper.repository");
const getOtp_1 = __importDefault(require("../utils/helper/getOtp"));
const getExpiryTime_1 = __importDefault(require("../utils/helper/getExpiryTime"));
const publisher_1 = require("../lib/rabbitMq/publisher");
const isExpired_1 = __importDefault(require("../utils/helper/isExpired"));
const user_repository_1 = require("../repositories/user.repository");
const logger_1 = require("../utils/serverTools/logger");
const validateUserStatus_1 = require("../utils/helper/validateUserStatus");
const jwt_1 = require("../utils/jwt/jwt");
const appConfig_1 = require("../config/appConfig");
const getRemainingMitutes_1 = require("../utils/helper/getRemainingMitutes");
const comparePassword_1 = __importDefault(require("../utils/helper/comparePassword"));
const auth_repository_1 = require("../repositories/auth.repository");
const registerUser = (userData, profileData) => __awaiter(void 0, void 0, void 0, function* () {
    const user_email = userData.email.toLowerCase().trim();
    const existing = yield user_repository_1.UserRepository.findByEmail(user_email);
    if (existing === null || existing === void 0 ? void 0 : existing.is_verified) {
        throw new Error("User already exists with this email.");
    }
    if (existing &&
        (!existing.is_verified ||
            ["deleted", "pending_verification"].includes(existing.status))) {
        yield user_repository_1.UserRepository.deleteUser(existing.id);
    }
    const password_hash = yield (0, getHashedPassword_1.default)(userData.password);
    const otp = (0, getOtp_1.default)(4).toString();
    const expire_time = (0, getExpiryTime_1.default)(10);
    try {
        const { user } = yield helper_repository_1.Repository.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield auth_repository_1.AuthRepository.createUser({
                email: user_email,
                password_hash,
                role: userData.role,
                is_verified: false,
                status: "pending_verification",
            }, trx);
            yield auth_repository_1.AuthRepository.createProfile(Object.assign(Object.assign({}, profileData), { user_id: user.id }), trx);
            yield auth_repository_1.AuthRepository.createAuthentication({
                user_id: user.id,
                otp,
                expire_time,
                verification_type: "email",
            }, trx);
            if (userData.role === "mechanic") {
                yield auth_repository_1.AuthRepository.createWorkshop({ user_id: user.id }, trx);
                yield auth_repository_1.AuthRepository.createMechanicPaymentInfo({ user_id: user.id }, trx);
            }
            if (userData.role === "user") {
                yield auth_repository_1.AuthRepository.createUserCarinfo({ user_id: user.id }, trx);
            }
            yield auth_repository_1.AuthRepository.createUserLocationinfo({ user_id: user.id }, trx);
            return { user };
        }));
        (0, publisher_1.publishJob)("emailQueue", {
            to: user.email,
            subject: "Verification",
            code: otp,
            project_name: "WrenchWave",
            expire_time: "10 min",
            purpose: "Verify your email",
        });
        return { id: user.id, email: user.email };
    }
    catch (err) {
        throw new Error((err === null || err === void 0 ? void 0 : err.message) || "Registration failed");
    }
});
const verifyUser = (user_id, code) => __awaiter(void 0, void 0, void 0, function* () {
    const getAuthenticationData = yield auth_repository_1.AuthRepository.getAuthenticationByUserIdAndCode(user_id, code);
    if (!getAuthenticationData) {
        throw new AppError_1.AppError("Code not matched. Try again.", 404);
    }
    if (getAuthenticationData.is_success) {
        throw new AppError_1.AppError("You already use this code successfully.", 400);
    }
    if ((0, isExpired_1.default)(getAuthenticationData.expire_time)) {
        throw new AppError_1.AppError("Time expired. Try resend code.", 400);
    }
    try {
        const { updated_data: updated_user, updated_auth } = yield helper_repository_1.Repository.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const updated_data = yield user_repository_1.UserRepository.updateUser(user_id, { is_verified: true, status: "active" }, trx);
            if (!updated_data.is_verified) {
                throw new AppError_1.AppError("Failed to verify user. Try again.", 400);
            }
            const updated_auth = yield auth_repository_1.AuthRepository.setAuthenticationSuccess(getAuthenticationData.id, true, trx);
            if (!updated_auth.is_success) {
                throw new AppError_1.AppError("Failed to verify user. Try again.", 400);
            }
            return { updated_data, updated_auth };
        }));
        const jwt_payload = {
            user_email: updated_user.email,
            user_id: updated_user.id,
            user_role: updated_user.role,
        };
        const access_token = jwt_1.jsonWebToken.generateToken(jwt_payload, appConfig_1.appConfig.jwt.jwt_access_secret, appConfig_1.appConfig.jwt.jwt_access_exprire);
        const refress_token = jwt_1.jsonWebToken.generateToken(jwt_payload, appConfig_1.appConfig.jwt.jwt_refresh_secret, appConfig_1.appConfig.jwt.jwt_refresh_exprire);
        const decoded_access_token = jwt_1.jsonWebToken.decodeToken(access_token);
        const decoded_refresh_token = jwt_1.jsonWebToken.decodeToken(refress_token);
        return {
            access_token,
            refress_token,
            user_id: updated_user.id,
            access_token_expire: decoded_access_token.exp,
            refresh_token_expire: decoded_refresh_token.exp,
            user_role: decoded_access_token.user_role,
        };
    }
    catch (error) {
        throw error;
    }
});
const userLogin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.role) {
        logger_1.logger.info("No action take for role. Role has no value");
    }
    const user_data = yield user_repository_1.UserRepository.findByEmail(data.email.toLowerCase().trim());
    if (!user_data) {
        throw new AppError_1.AppError("Account not found. Please check your email", 404);
    }
    if (!user_data.is_verified) {
        throw new AppError_1.AppError("Account is not verified.", 400);
    }
    if (user_data.role !== data.role) {
        logger_1.logger.info("No action take for mismatch. role not matched");
    }
    (0, validateUserStatus_1.validateUserStatus)(user_data.status);
    if (!(yield (0, comparePassword_1.default)(data.password, user_data.password_hash))) {
        throw new AppError_1.AppError("Password not matched.");
    }
    const jwt_payload = {
        user_email: user_data.email,
        user_id: user_data.id,
        user_role: user_data.role,
    };
    const access_token = jwt_1.jsonWebToken.generateToken(jwt_payload, appConfig_1.appConfig.jwt.jwt_access_secret, appConfig_1.appConfig.jwt.jwt_access_exprire);
    const refress_token = jwt_1.jsonWebToken.generateToken(jwt_payload, appConfig_1.appConfig.jwt.jwt_refresh_secret, appConfig_1.appConfig.jwt.jwt_refresh_exprire);
    const decoded_access_token = jwt_1.jsonWebToken.decodeToken(access_token);
    const decoded_refresh_token = jwt_1.jsonWebToken.decodeToken(refress_token);
    return {
        access_token,
        refress_token,
        user_id: user_data.id,
        access_token_expire: decoded_access_token.exp,
        refresh_token_expire: decoded_refresh_token.exp,
        user_role: decoded_access_token.user_role,
        is_profile_updated: user_data.profile.is_profile_completed,
    };
});
const resendCode = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user_data = yield user_repository_1.UserRepository.findById(user_id);
    if (!user_data) {
        throw new AppError_1.AppError("Account not found.", 404);
    }
    const latest_auth = yield auth_repository_1.AuthRepository.getAuthenticationByUserId(user_id);
    if (latest_auth && !(0, isExpired_1.default)(latest_auth.expire_time)) {
        const remain = (0, getRemainingMitutes_1.getRemainingMinutes)(latest_auth.expire_time);
        throw new AppError_1.AppError(`You can request for code again after ${remain} minutes`, 404);
    }
    const code = String((0, getOtp_1.default)(4));
    const expire_time = (0, getExpiryTime_1.default)(10);
    yield auth_repository_1.AuthRepository.createAuthentication({
        otp: code,
        expire_time,
        user_id,
        is_success: false,
        verification_type: "resend",
    });
    yield (0, publisher_1.publishJob)("emailQueue", {
        to: user_data.email,
        subject: "Resend",
        code: code,
        project_name: "WrenchWave",
        expire_time: "10 min",
        purpose: "verify",
    });
});
const forgotPassword = (user_email) => __awaiter(void 0, void 0, void 0, function* () {
    const user_data = yield user_repository_1.UserRepository.findByEmail(user_email === null || user_email === void 0 ? void 0 : user_email.toLowerCase());
    if (!user_data) {
        throw new AppError_1.AppError("Account not found.", 404);
    }
    const code = String((0, getOtp_1.default)(4));
    const expire_time = (0, getExpiryTime_1.default)(10);
    yield auth_repository_1.AuthRepository.createAuthentication({
        otp: code,
        expire_time,
        user_id: user_data.id,
        is_success: false,
        verification_type: "forgot-password",
    });
    yield (0, publisher_1.publishJob)("emailQueue", {
        to: user_data.email,
        subject: "Forgot Password",
        code: code,
        project_name: "WrenchWave",
        expire_time: "10 min",
        purpose: "verify",
    });
    return {
        message: "A code has been sent to your email.",
        user_id: user_data.id,
    };
});
const verifyForgotPasswordReq = (user_id, code) => __awaiter(void 0, void 0, void 0, function* () {
    const user_data = yield user_repository_1.UserRepository.findById(user_id);
    if (!user_data) {
        throw new AppError_1.AppError("Account not found.", 404);
    }
    const getAuthenticationData = yield auth_repository_1.AuthRepository.getAuthenticationByUserIdAndCode(user_id, code);
    if (!getAuthenticationData) {
        throw new AppError_1.AppError("Code not matched. Try again.", 404);
    }
    if (getAuthenticationData.is_success) {
        throw new AppError_1.AppError("You already use this code successfully.", 400);
    }
    if ((0, isExpired_1.default)(getAuthenticationData.expire_time)) {
        throw new AppError_1.AppError("Time expired. Try resend code.", 400);
    }
    const expire_time = (0, getExpiryTime_1.default)(10);
    const jwt_payload = {
        user_email: user_data.email,
        user_id: user_data.id,
        user_role: user_data.role,
    };
    const access_toekn = jwt_1.jsonWebToken.generateToken(jwt_payload, appConfig_1.appConfig.jwt.jwt_access_secret, appConfig_1.appConfig.jwt.jwt_access_exprire);
    try {
        yield helper_repository_1.Repository.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const updated_data = yield user_repository_1.UserRepository.updateUser(user_id, { need_to_reset_password: true }, trx);
            if (!updated_data.need_to_reset_password) {
                throw new AppError_1.AppError("Failed to verify password reset request. Try again.", 400);
            }
            const updated_auth = yield auth_repository_1.AuthRepository.setAuthenticationSuccess(getAuthenticationData.id, true, trx);
            if (!updated_auth.is_success) {
                throw new AppError_1.AppError("Failed to verify password reset request. Try again.", 400);
            }
            yield auth_repository_1.AuthRepository.createAuthentication({
                expire_time,
                user_id: user_id,
                is_success: false,
                token: access_toekn,
                verification_type: "token",
            });
        }));
        return { token: access_toekn };
    }
    catch (error) {
        throw error;
    }
});
const resetPassword = (token, password_data) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded_data;
    try {
        decoded_data = jwt_1.jsonWebToken.decodeToken(token);
    }
    catch (error) {
        throw new AppError_1.AppError("Failed to update password.", 500);
    }
    if (decoded_data && !decoded_data.user_id) {
        throw new AppError_1.AppError("Failed to update password.", 500);
    }
    const user_data = yield user_repository_1.UserRepository.findById(decoded_data.user_id);
    const user_auth_data = yield auth_repository_1.AuthRepository.getAuthenticationByUserIdAndToken(decoded_data.user_id, token);
    if (!user_data) {
        throw new AppError_1.AppError("Failed to update password.", 500);
    }
    if (!user_data.need_to_reset_password) {
        throw new AppError_1.AppError("Failed to update password.", 500);
    }
    if (!user_auth_data) {
        throw new AppError_1.AppError("Failed to update password.", 500);
    }
    if (password_data.confirm_password !== password_data.new_password) {
        throw new AppError_1.AppError("Password and Confirm password not matched", 500);
    }
    const hashed_password = yield (0, getHashedPassword_1.default)(password_data.new_password);
    try {
        return yield helper_repository_1.Repository.transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            yield auth_repository_1.AuthRepository.setAuthenticationSuccess(user_auth_data.id, true, trx);
            yield user_repository_1.UserRepository.updateUser(user_data.id, {
                need_to_reset_password: false,
                password_hash: hashed_password,
                updated_at: new Date(),
            }, trx);
            return { message: "Password reset successfully." };
        }));
    }
    catch (error) {
        throw new AppError_1.AppError("Failed to update password.", 400);
    }
});
const updatePassword = (user_id, password_data) => __awaiter(void 0, void 0, void 0, function* () {
    const user_data = yield user_repository_1.UserRepository.findById(user_id);
    if (!user_data) {
        throw new AppError_1.AppError("Account not found.");
    }
    if (!(yield (0, comparePassword_1.default)(password_data.old_password, user_data.password_hash))) {
        throw new AppError_1.AppError("Old password not matched.");
    }
    if (password_data.confirm_password !== password_data.new_password) {
        throw new AppError_1.AppError("New password and confirm password not matched.");
    }
    const hashed_password = yield (0, getHashedPassword_1.default)(password_data.new_password);
    yield user_repository_1.UserRepository.updateUser(user_id, {
        password_hash: hashed_password,
        updated_at: new Date(),
    });
    return { message: "Password updated successfully" };
});
const getNewAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded_data = jwt_1.jsonWebToken.verifyJwt(token, appConfig_1.appConfig.jwt.jwt_refresh_secret);
        if (!decoded_data.user_id) {
            throw new AppError_1.AppError("Please login again.");
        }
        const user_data = yield user_repository_1.UserRepository.findById(decoded_data.user_id);
        if (!user_data) {
            throw new AppError_1.AppError("Please login again.");
        }
        const payload = {
            user_email: user_data.email,
            user_id: user_data.id,
            user_role: user_data.role,
        };
        const access_token = jwt_1.jsonWebToken.generateToken(payload, appConfig_1.appConfig.jwt.jwt_access_secret, appConfig_1.appConfig.jwt.jwt_access_exprire);
        const decoded_access_token = jwt_1.jsonWebToken.decodeToken(access_token);
        return {
            access_token,
            access_token_expire: decoded_access_token.exp,
        };
    }
    catch (error) {
        throw new AppError_1.AppError("Please login again.");
    }
});
exports.AuthService = {
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
