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
exports.RatingService = void 0;
const rating_repository_1 = require("../repositories/rating.repository");
const user_service_repository_1 = require("../repositories/user_service.repository");
const AppError_1 = require("../utils/serverTools/AppError");
const ratingGivenByMechanic = (data, mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const service_progress_data = yield user_service_repository_1.ServiceRepository.getServiceProgressById(data.service_progress_id);
    if (!service_progress_data) {
        throw new AppError_1.AppError("Service data not found.", 404);
    }
    return yield rating_repository_1.RatingRepository.ratingGivenByMechanic(Object.assign(Object.assign({}, data), { mechanic_id, user_id: service_progress_data === null || service_progress_data === void 0 ? void 0 : service_progress_data.user_id }));
});
const ratingGivenByUser = (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const service_progress_data = yield user_service_repository_1.ServiceRepository.getServiceProgressById(data.service_progress_id);
    if (!service_progress_data) {
        throw new AppError_1.AppError("Service data not found.", 404);
    }
    if (!service_progress_data.mechanic_id) {
        throw new AppError_1.AppError("Mechanic id not found.", 404);
    }
    return yield rating_repository_1.RatingRepository.ratingGivenByUser(Object.assign(Object.assign({}, data), { mechanic_id: service_progress_data.mechanic_id, user_id: user_id }));
});
const getUserRatingData = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield rating_repository_1.RatingRepository.getUserRatingData(user_id);
});
const getMechanicRatingData = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield rating_repository_1.RatingRepository.getMechanicRatingData(mechanic_id);
});
exports.RatingService = {
    ratingGivenByMechanic,
    ratingGivenByUser,
    getUserRatingData,
    getMechanicRatingData,
};
