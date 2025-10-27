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
exports.BidController = void 0;
const catchAsync_1 = __importDefault(require("../utils/serverTools/catchAsync"));
const sendResponse_1 = __importDefault(require("../utils/serverTools/sendResponse"));
const bid_service_1 = require("../services/bid.service");
const makeBid = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bid_service_1.BidService.makeBid(req.user.user_id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Bid added successfully",
        status_code: 200,
        data: result,
    });
}));
const getMechanicBidHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bid_service_1.BidService.getMechanicBidHistory(req.user.user_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Bid history fetched successfully",
        status_code: 200,
        data: result,
    });
}));
const getBidListOfaService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bid_service_1.BidService.getBidListOfaService(req.params.s_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Bid list of a service fetched successfully",
        status_code: 200,
        data: result,
    });
}));
const getBidDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bid_service_1.BidService.getBidDetails(req.params.b_id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Bid details fetched successfully",
        status_code: 200,
        data: result,
    });
}));
exports.BidController = {
    makeBid,
    getMechanicBidHistory,
    getBidListOfaService,
    getBidDetails,
};
