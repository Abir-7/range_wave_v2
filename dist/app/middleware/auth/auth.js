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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const AppError_1 = require("../../utils/serverTools/AppError");
const jwt_1 = require("../../utils/jwt/jwt");
const user_repository_1 = require("../../repositories/user.repository");
const auth = (allowed_roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token_with_bearer = req.headers.authorization;
    if (!token_with_bearer || !token_with_bearer.startsWith("Bearer")) {
        return next(new AppError_1.AppError("You are not authorized", 401));
    }
    const token = token_with_bearer.split(" ")[1];
    if (token === "null") {
        return next(new AppError_1.AppError("You are not authorized", 401));
    }
    try {
        const decoded_data = jwt_1.jsonWebToken.decodeToken(token);
        const user_data = yield user_repository_1.UserRepository.findById(decoded_data.user_id);
        if (!user_data) {
            throw new AppError_1.AppError("You are unauthorize", 401);
        }
        if (!allowed_roles.includes(user_data.role)) {
            throw new AppError_1.AppError("You are unauthorize", 401);
        }
        req.user = {
            user_email: decoded_data.user_email,
            user_id: decoded_data.user_id,
            user_role: decoded_data.user_role,
        };
        next();
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.auth = auth;
