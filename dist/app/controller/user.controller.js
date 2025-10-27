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
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../utils/serverTools/catchAsync"));
const user_service_1 = require("../services/user.service");
const sendResponse_1 = __importDefault(require("../utils/serverTools/sendResponse"));
const getRelativeFilePath_1 = require("../utils/helper/getRelativeFilePath");
const appConfig_1 = require("../config/appConfig");
const updateMechanicsWorkshopData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateMechanicsWorkshopData(req.body, req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Workshop data updated succesfully",
        status_code: 200,
        data: result,
    });
}));
const updateUserCarData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.updateUserCarInfo(req.user.user_id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User car data updated succesfully",
        status_code: 200,
        data: result,
    });
}));
const updateUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const filePath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    console.log(filePath);
    const user_data = Object.assign(Object.assign({}, req.body), (filePath && {
        image: `${appConfig_1.appConfig.server.base_url}${(0, getRelativeFilePath_1.getRelativePath)(filePath)}`,
        image_id: (0, getRelativeFilePath_1.getRelativePath)(filePath),
    }));
    const result = yield user_service_1.UserService.updateUserProfile(req.user.user_id, user_data);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User profile data updated succesfully",
        status_code: 200,
        data: result,
    });
}));
const createAndConnectStripeAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createAndConnectStripeAccount(req.user.user_id, req.user.user_email);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Connect link created.",
        status_code: 200,
        data: result,
    });
}));
const getMechanicsEarningData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getMechanicsEarningData(req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Earnig data fetched successfully",
        status_code: 200,
        data: result,
    });
}));
exports.UserController = {
    updateMechanicsWorkshopData,
    createAndConnectStripeAccount,
    updateUserCarData,
    updateUserProfile,
    getMechanicsEarningData,
};
