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
exports.UserService = void 0;
const helper_repository_1 = require("../repositories/helper.repository");
const payment_repository_1 = require("../repositories/payment.repository");
const payment_for_workshop_repository_1 = require("../repositories/payment_for_workshop.repository");
const stripe_repository_1 = require("../repositories/stripe.repository");
const user_repository_1 = require("../repositories/user.repository");
const checkDistanse_1 = require("../utils/helper/checkDistanse");
const splitUserData_1 = require("../utils/helper/splitUserData");
const unlinkFile_1 = __importDefault(require("../utils/helper/unlinkFile"));
const AppError_1 = require("../utils/serverTools/AppError");
const updateMechanicsWorkshopData = (data, mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const is_payment_done = yield payment_for_workshop_repository_1.WorkshopPaymentRepository.findWorkshopPaymentByMechanicId(mechanic_id);
    return yield helper_repository_1.Repository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1) Update user profile
        const update_profile = yield user_repository_1.UserRepository.updateUserProfile(mechanic_id, Object.assign(Object.assign({}, data.profile), { is_profile_completed: true }), tx);
        // 2) Prepare workshop update
        const coordinates = data.workshop.coordinates.map((c) => c.toString());
        let is_conflict;
        if ((is_payment_done === null || is_payment_done === void 0 ? void 0 : is_payment_done.status) === "paid") {
            is_conflict = true;
        }
        else if (data.workshop.coordinates.length >= 2) {
            const coords = [
                Number(data.workshop.coordinates[0]),
                Number(data.workshop.coordinates[1]),
            ];
            is_conflict = yield (0, checkDistanse_1.checkNearbyWorkshops)(coords, mechanic_id);
        }
        else {
            is_conflict = false;
        }
        // 3) Update workshop
        const update_workshop = yield user_repository_1.UserRepository.update_workshop_data(Object.assign(Object.assign({ user_id: update_profile.user_id }, data.workshop), { coordinates,
            is_conflict }), mechanic_id, tx);
        return Object.assign(Object.assign({}, update_workshop), { is_profile_updated: update_profile.is_profile_completed });
    }));
});
const createAndConnectStripeAccount = (mechanicUserId, mechanicEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield stripe_repository_1.StripeRepository.createStripeConnectAccountLink(mechanicUserId, mechanicEmail);
});
const updateUserCarInfo = (user_id, car_data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield helper_repository_1.Repository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const update_profile = yield user_repository_1.UserRepository.updateUserProfile(user_id, {
            is_profile_completed: true,
        }, tx);
        const updated_car_info = yield user_repository_1.UserRepository.updateUserCarData(car_data, user_id);
        return Object.assign(Object.assign({}, updated_car_info), { is_profile_updated: update_profile.is_profile_completed });
    }));
});
const updateUserProfile = (user_id, user_data) => __awaiter(void 0, void 0, void 0, function* () {
    const { profile_data, location_data } = (0, splitUserData_1.splitUserData)(user_data);
    const user_profile_data = yield user_repository_1.UserRepository.getProfileData(user_id);
    if (!user_profile_data)
        throw new AppError_1.AppError("User not found.", 404);
    const old_image_id = user_profile_data.image_id;
    const new_image_id = profile_data.image_id;
    // declare to capture results
    let updated_data;
    let updated_location;
    yield helper_repository_1.Repository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        updated_data = yield user_repository_1.UserRepository.updateUserProfile(user_id, profile_data, tx);
        updated_location = yield user_repository_1.UserRepository.updateLocationData(location_data, user_id, tx);
    }));
    // after tx commit
    if (new_image_id && old_image_id) {
        (0, unlinkFile_1.default)(old_image_id);
    }
    // if profile update fails, clean uploaded new image
    if (!updated_data && new_image_id) {
        (0, unlinkFile_1.default)(new_image_id);
    }
    return Object.assign(Object.assign({}, updated_data), updated_location);
});
const getMechanicsEarningData = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield payment_repository_1.PaymentRepository.getMechanicsEarningData(mechanic_id);
});
exports.UserService = {
    updateMechanicsWorkshopData,
    createAndConnectStripeAccount,
    updateUserCarInfo,
    updateUserProfile,
    getMechanicsEarningData,
};
