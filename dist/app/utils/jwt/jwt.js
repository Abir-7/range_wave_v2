"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonWebToken = void 0;
const jwt_decode_1 = require("jwt-decode");
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJwt = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw new Error(error);
    }
};
const generateToken = (payload, secret, expiresIn) => {
    try {
        const token = jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn,
        });
        return token;
    }
    catch (error) {
        throw new Error(error);
    }
};
const decodeToken = (token) => {
    try {
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        return decoded;
    }
    catch (error) {
        console.error("JWT decode error:", error);
        throw new Error(error);
    }
};
exports.jsonWebToken = {
    verifyJwt,
    generateToken,
    decodeToken,
};
