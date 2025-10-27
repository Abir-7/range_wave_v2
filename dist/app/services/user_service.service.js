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
exports.UserServiceReqService = void 0;
const helper_repository_1 = require("../repositories/helper.repository");
const user_repository_1 = require("../repositories/user.repository");
const user_service_repository_1 = require("../repositories/user_service.repository");
const user_service_progress_repository_1 = require("../repositories/user_service_progress.repository");
const AppError_1 = require("../utils/serverTools/AppError");
const makeServiceReq = (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const car_data = yield user_repository_1.UserRepository.getUserCarData(user_id);
    if (!car_data || (car_data && !car_data.car_model)) {
        throw new AppError_1.AppError("Please add your car info to make service request.");
    }
    return yield helper_repository_1.Repository.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const service_Data = Object.assign(Object.assign({}, data), { scheduled_date: data.scheduled_date
                ? new Date(data.scheduled_date)
                : null, user_id });
        console.log("-----------", service_Data, "GG");
        const [created_service] = yield user_service_repository_1.ServiceRepository.makeServiceReq(service_Data, tx);
        let is_scheduled = false;
        if (created_service.scheduled_date) {
            is_scheduled = true;
        }
        const [created_service_progress] = yield user_service_repository_1.ServiceRepository.makeServiceProgres({
            service_id: created_service.id,
            user_id,
            is_scheduled,
        }, tx);
        return Object.assign(Object.assign({}, created_service), { service_progress_id: created_service_progress.id });
    }));
});
const getLatestRunningService = (user_id, user_role) => __awaiter(void 0, void 0, void 0, function* () {
    if (user_role === "user") {
        const getRunningProgress = yield user_service_progress_repository_1.ServiceProgressRepository.getUsersRunningProgress(user_id);
        return getRunningProgress;
    }
    if (user_role === "mechanic") {
        const getRunningProgress = yield user_service_progress_repository_1.ServiceProgressRepository.getMechanicsRunningProgress(user_id);
        return getRunningProgress;
    }
    return {};
});
//--------------------------For mechanics
const getAvailableServicesForMechanic = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const available_services = yield user_service_repository_1.ServiceRepository.getAvailableServicesForMechanic(mechanic_id);
    return available_services;
});
const getServiceDetails = (s_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_service_repository_1.ServiceRepository.getServiceDetails(s_id);
});
//============ common============
const getRunningServiceDetails = (s_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_service_repository_1.ServiceRepository.runningServiceDetails(s_id);
});
exports.UserServiceReqService = {
    makeServiceReq,
    getLatestRunningService,
    getAvailableServicesForMechanic,
    getServiceDetails,
    getRunningServiceDetails,
};
