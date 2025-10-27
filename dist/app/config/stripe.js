"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
// src/config/stripe.ts
const stripe_1 = __importDefault(require("stripe"));
const appConfig_1 = require("./appConfig");
exports.stripe = new stripe_1.default(appConfig_1.appConfig.stripe.secret_key, {
    apiVersion: "2025-09-30.clover",
});
