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
exports.BidService = void 0;
const bid_repository_1 = require("../repositories/bid.repository");
const user_repository_1 = require("../repositories/user.repository");
const AppError_1 = require("../utils/serverTools/AppError");
const makeBid = (mechanic_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const workshop_data = yield user_repository_1.UserRepository.getMechanicsWorkshopData(mechanic_id);
    console.log(workshop_data);
    if (!workshop_data) {
        throw new AppError_1.AppError("Workshop location not updated.", 404);
    }
    if (workshop_data &&
        (!workshop_data.coordinates || workshop_data.coordinates.length !== 2)) {
        throw new AppError_1.AppError("Workshop location not updated.", 404);
    }
    const mechanic_payment_info = yield user_repository_1.UserRepository.getMechanicsPaymentData(mechanic_id);
    if (!mechanic_payment_info ||
        !mechanic_payment_info.is_active ||
        !mechanic_payment_info.account_id) {
        throw new AppError_1.AppError("Please setup your payment from profile section.", 400);
        return {
            is_payment_profile_active: false,
            service_id: null,
            bid_id: null,
        };
    }
    const new_bid = yield bid_repository_1.BidRepository.addBid(Object.assign(Object.assign({}, data), { mechanic_id, status: "provided" }));
    return {
        is_payment_profile_active: mechanic_payment_info.is_active,
        service_id: new_bid.service_id,
        bid_id: new_bid.id,
    };
});
const getMechanicBidHistory = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bid_repository_1.BidRepository.getMechanicBidHistory(mechanic_id);
});
// =========== USER ===============
const getBidListOfaService = (service_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bid_repository_1.BidRepository.getBidListOfaService(service_id);
});
const getBidDetails = (bid_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bid_repository_1.BidRepository.getBidDetails(bid_id);
});
exports.BidService = {
    makeBid,
    getMechanicBidHistory,
    getBidListOfaService,
    getBidDetails,
};
