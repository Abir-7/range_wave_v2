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
exports.ServiceProgressController = void 0;
const catchAsync_1 = __importDefault(require("../utils/serverTools/catchAsync"));
const sendResponse_1 = __importDefault(require("../utils/serverTools/sendResponse"));
const user_service_progress_service_1 = require("../services/user_service_progress.service");
const hireMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_progress_service_1.ServiceProgressService.hireMechanic(req.body, req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Mechanic successfully hired for your service.",
        status_code: 200,
        data: result,
    });
}));
const markAsComplete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_progress_service_1.ServiceProgressService.markAsComplete(req.params.s_id, req.body.payment_mode);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Service mark as completed.",
        status_code: 200,
        data: result,
    });
}));
const acceptOrRejectExtraWork = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_progress_service_1.ServiceProgressService.acceptOrRejectExtraWork(req.body.status, req.params.s_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Service Status changed successfully.",
        status_code: 200,
        data: result,
    });
}));
// ====== mechanic =======
const changeServiveStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_progress_service_1.ServiceProgressService.changeServiceStatus(req.params.s_id, req.body.status);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Service Status changed successfully.",
        status_code: 200,
        data: result,
    });
}));
const addExtraWorkData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_progress_service_1.ServiceProgressService.addExtraWorkData(req.body, req.params.s_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Service Status changed successfully.",
        status_code: 200,
        data: result,
    });
}));
// ========== Common =============
const getAllRunningServiceProgressOfUserOrMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_progress_service_1.ServiceProgressService.getAllRunningServiceProgress(req.user.user_id, req.user.user_role, req.query.service_status);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Service Status changed successfully.",
        status_code: 200,
        data: result,
    });
}));
exports.ServiceProgressController = {
    hireMechanic,
    changeServiveStatus,
    markAsComplete,
    getAllRunningServiceProgressOfUserOrMechanic,
    addExtraWorkData,
    acceptOrRejectExtraWork,
};
