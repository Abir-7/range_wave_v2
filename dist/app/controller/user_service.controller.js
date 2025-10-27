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
exports.UserServiceController = void 0;
const catchAsync_1 = __importDefault(require("../utils/serverTools/catchAsync"));
const sendResponse_1 = __importDefault(require("../utils/serverTools/sendResponse"));
const user_service_service_1 = require("../services/user_service.service");
const makeServiceReq = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_service_1.UserServiceReqService.makeServiceReq(req.body, req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "A Service requiest successfully created.",
        status_code: 200,
        data: result,
    });
}));
const getLatestRunningService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_service_1.UserServiceReqService.getLatestRunningService(req.user.user_id, req.user.user_role);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Users running service fetched successfully",
        status_code: 200,
        data: result,
    });
}));
//--------------------------for mechanics----------
const getAvailableServicesForMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_service_1.UserServiceReqService.getAvailableServicesForMechanic(req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Available service for bids fetched succesfully",
        status_code: 200,
        data: result,
    });
}));
const getServiceDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_service_1.UserServiceReqService.getServiceDetails(req.params.s_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Service details fetched succesfully",
        status_code: 200,
        data: result,
    });
}));
//============ common=====
const getRunningServiceDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_service_1.UserServiceReqService.getRunningServiceDetails(req.params.s_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Running service details fetched succesfully",
        status_code: 200,
        data: result,
    });
}));
exports.UserServiceController = {
    makeServiceReq,
    getLatestRunningService,
    getAvailableServicesForMechanic,
    getServiceDetails,
    getRunningServiceDetails,
};
