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
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const catchAsync_1 = __importDefault(require("../utils/serverTools/catchAsync"));
const sendResponse_1 = __importDefault(require("../utils/serverTools/sendResponse"));
const AppError_1 = require("../utils/serverTools/AppError");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, profile } = req.body;
    if (!email || !password || !profile || !role) {
        throw new AppError_1.AppError("Email, password, role, and profile data are required", 400);
    }
    console.time("create-user");
    const result = yield auth_service_1.AuthService.registerUser({ email, password, role }, profile);
    console.timeEnd("create-user");
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User created successfully",
        status_code: 200,
        data: result,
    });
}));
const verifyUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, code } = req.body;
    const result = yield auth_service_1.AuthService.verifyUser(user_id, code);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User successfully verified.",
        status_code: 200,
        data: result,
    });
}));
const userLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.userLogin(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User successfully login.",
        status_code: 200,
        data: result,
    });
}));
const resendCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.resendCode(req.body.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Code successfully resend.",
        status_code: 200,
        data: result,
    });
}));
const reqForgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield auth_service_1.AuthService.forgotPassword(req.body.email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "A code has been sent to your email.",
        status_code: 200,
        data: createdUser,
    });
}));
const verifyForgotPasswordReq = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.verifyForgotPasswordReq(req.body.user_id, req.body.code);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Verification successfull.",
        status_code: 200,
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const result = yield auth_service_1.AuthService.resetPassword(token, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password successfully reset.",
        status_code: 200,
        data: result,
    });
}));
const updatePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const result = yield auth_service_1.AuthService.updatePassword(req.user.user_id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password successfully updated.",
        status_code: 200,
        data: result,
    });
}));
const getNewAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const result = yield auth_service_1.AuthService.getNewAccessToken(req.body.token);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "New access token created successfully.",
        status_code: 200,
        data: result,
    });
}));
exports.AuthController = {
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
