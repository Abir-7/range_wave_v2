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
exports.UserRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const user_schema_1 = require("../schema/user/user.schema");
const mechanics_workshop_schema_1 = require("../schema/user/mechanics_workshop.schema");
const user_profiles_schema_1 = require("../schema/user/user_profiles.schema");
const mechanic_payment_data_schema_1 = require("../schema/user/mechanic_payment_data.schema");
const user_location_schema_1 = require("../schema/user/user_location.schema");
const user_carinfo_schema_1 = require("../schema/user/user_carinfo.schema");
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield db_1.db.query.Users.findMany({
        where: (0, drizzle_orm_1.eq)(user_schema_1.Users.email, email),
        with: {
            profile: true, // assuming you have a relation named 'profile' in UsersRelations
        },
    });
    return user || null;
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield db_1.db.select().from(user_schema_1.Users).where((0, drizzle_orm_1.eq)(user_schema_1.Users.id, id));
    return user || null;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db.select().from(user_schema_1.Users);
});
const updateUser = (id, data, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield (trx || db_1.db)
        .update(user_schema_1.Users)
        .set(Object.assign(Object.assign({}, data), { updated_at: new Date() }))
        .where((0, drizzle_orm_1.eq)(user_schema_1.Users.id, id))
        .returning();
    return user;
});
const updateUserProfile = (id, data, trx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    const [profile] = yield (trx || db_1.db)
        .update(user_profiles_schema_1.UserProfiles)
        .set(Object.assign({}, data))
        .where((0, drizzle_orm_1.eq)(user_profiles_schema_1.UserProfiles.user_id, id))
        .returning();
    return profile;
});
const updateLocationData = (data, user_mechanic_id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const [updated_data] = yield client
        .update(user_location_schema_1.UserLocations)
        .set(Object.assign({}, data))
        .where((0, drizzle_orm_1.eq)(user_location_schema_1.UserLocations.user_id, user_mechanic_id))
        .returning();
    return updated_data;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(user_schema_1.Users).where((0, drizzle_orm_1.eq)(user_schema_1.Users.id, id));
    return true;
});
// ------------ mechanic data-------------
const getMechanicsWorkshopData = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db.query.MechanicWorkshop.findFirst({
        where: (0, drizzle_orm_1.eq)(mechanics_workshop_schema_1.MechanicWorkshop.user_id, mechanic_id),
    });
});
const getMechanicsPaymentData = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db.query.MechanicPaymentData.findFirst({
        where: (0, drizzle_orm_1.eq)(mechanic_payment_data_schema_1.MechanicPaymentData.user_id, mechanic_id),
    });
});
const updateMechanicPaymentData = (data, mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [updated_data] = yield db_1.db
        .update(Object.assign(Object.assign({}, mechanic_payment_data_schema_1.MechanicPaymentData), { updated_at: new Date() }))
        .set(data)
        .where((0, drizzle_orm_1.eq)(mechanic_payment_data_schema_1.MechanicPaymentData.user_id, mechanic_id))
        .returning();
    return updated_data;
});
const update_workshop_data = (data, mechanic_id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const [updated] = yield client
        .update(mechanics_workshop_schema_1.MechanicWorkshop)
        .set(Object.assign(Object.assign({}, data), { updated_at: new Date() }))
        .where((0, drizzle_orm_1.eq)(mechanics_workshop_schema_1.MechanicWorkshop.user_id, mechanic_id))
        .returning();
    return updated;
});
const updateUserCarData = (data, user_id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const [updated_data] = yield client
        .update(user_carinfo_schema_1.UserCars)
        .set(Object.assign(Object.assign({}, data), { updated_at: new Date() }))
        .where((0, drizzle_orm_1.eq)(user_carinfo_schema_1.UserCars.user_id, user_id))
        .returning();
    return updated_data;
});
const getProfileData = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user_data = yield db_1.db.query.UserProfiles.findFirst({
        where: (0, drizzle_orm_1.eq)(user_profiles_schema_1.UserProfiles.user_id, user_id),
    });
    return user_data;
});
const getUserCarData = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user_car_data = yield db_1.db.query.UserCars.findFirst({
        where: (0, drizzle_orm_1.eq)(user_carinfo_schema_1.UserCars.user_id, user_id),
    });
    return user_car_data;
});
exports.UserRepository = {
    findByEmail,
    findById,
    getAllUsers,
    updateUser,
    deleteUser,
    getMechanicsWorkshopData,
    update_workshop_data,
    getMechanicsPaymentData,
    updateUserProfile,
    updateMechanicPaymentData,
    updateLocationData,
    updateUserCarData,
    getProfileData,
    getUserCarData,
};
