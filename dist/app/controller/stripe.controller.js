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
exports.StripeController = void 0;
const catchAsync_1 = __importDefault(require("../utils/serverTools/catchAsync"));
const stripe_service_1 = require("../services/stripe.service");
const sendResponse_1 = __importDefault(require("../utils/serverTools/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createPaymentIntentForMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield stripe_service_1.StripeService.createPaymentIntentForMechanic(Number(req.body.price), req.user.user_id, (_a = req.body) === null || _a === void 0 ? void 0 : _a.type);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Secrete created successfully.",
        status_code: 200,
        data: result,
    });
}));
const stripeWebhook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    const rawBody = req.body;
    console.log(rawBody);
    const result = yield stripe_service_1.StripeService.stripeWebhook(rawBody, sig);
    (0, sendResponse_1.default)(res, {
        success: true,
        status_code: http_status_1.default.OK,
        message: "Webhook response",
        data: result,
    });
}));
const checkEligibility = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield stripe_service_1.StripeService.checkEligibility(req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        status_code: http_status_1.default.OK,
        message: "Success",
        data: result,
    });
}));
const getMechanicStripeDashboardLink = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield stripe_service_1.StripeService.getMechanicStripeDashboardLink(req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        status_code: http_status_1.default.OK,
        message: "Success",
        data: result,
    });
}));
exports.StripeController = {
    createPaymentIntentForMechanic,
    stripeWebhook,
    checkEligibility,
    getMechanicStripeDashboardLink,
};
