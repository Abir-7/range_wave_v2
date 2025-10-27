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
exports.ServiceRepository = void 0;
const helper_repository_1 = require("./helper.repository");
const db_1 = require("../db");
const service_schema_1 = require("../schema/service_flow/service/service.schema");
const service_progress_schema_1 = require("../schema/service_flow/progress/service_progress.schema");
const drizzle_orm_1 = require("drizzle-orm");
const bid_schema_1 = require("../schema/service_flow/bid/bid.schema");
const given_by_mechanic_schema_1 = require("../schema/rating/given_by_mechanic/given_by_mechanic.schema");
const user_profiles_schema_1 = require("../schema/user/user_profiles.schema");
const user_schema_1 = require("../schema/user/user.schema");
const user_carinfo_schema_1 = require("../schema/user/user_carinfo.schema");
const makeServiceReq = (data, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    return yield client.insert(service_schema_1.Services).values(data).returning();
});
const makeServiceProgres = (data, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    return yield client
        .insert(service_progress_schema_1.ServiceProgress)
        .values(Object.assign({}, data))
        .returning();
});
//----------------------For mechanics------------------
const getAvailableServicesForMechanic = (mechanicId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db
        .select({
        service: {
            id: service_schema_1.Services.id,
            issue: service_schema_1.Services.issue,
            description: service_schema_1.Services.description,
            scheduled_date: service_schema_1.Services.scheduled_date,
            created_at: service_schema_1.Services.created_at,
            is_scheduled: service_progress_schema_1.ServiceProgress.is_scheduled,
            coordinates: service_schema_1.Services.coordinates,
            //  address: Services.address,
        },
        average_rating: (0, drizzle_orm_1.sql) `COALESCE(AVG(${given_by_mechanic_schema_1.RatingByMechanic.rating}), 0)`.as("average_rating"),
        user_profile_details: {
            //  user_id: UserProfiles.user_id,
            full_name: user_profiles_schema_1.UserProfiles.full_name,
            mobile: user_profiles_schema_1.UserProfiles.mobile,
            image: user_profiles_schema_1.UserProfiles.image,
        },
        user_details: {
            id: user_schema_1.Users.id,
            email: user_schema_1.Users.email,
            // role: Users.role,
            // is_verified: Users.is_verified,
            // status: Users.status,
        },
    })
        .from(service_schema_1.Services)
        .leftJoin(user_profiles_schema_1.UserProfiles, (0, drizzle_orm_1.eq)(user_profiles_schema_1.UserProfiles.user_id, service_schema_1.Services.user_id))
        .leftJoin(user_schema_1.Users, (0, drizzle_orm_1.eq)(user_schema_1.Users.id, service_schema_1.Services.user_id))
        .innerJoin(service_progress_schema_1.ServiceProgress, (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_id, service_schema_1.Services.id))
        .leftJoin(given_by_mechanic_schema_1.RatingByMechanic, (0, drizzle_orm_1.eq)(given_by_mechanic_schema_1.RatingByMechanic.user_id, service_schema_1.Services.user_id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_status, "FINDING"), (0, drizzle_orm_1.isNull)(service_progress_schema_1.ServiceProgress.bid_id), (0, drizzle_orm_1.notExists)(db_1.db
        .select()
        .from(bid_schema_1.Bids)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bid_schema_1.Bids.service_id, service_schema_1.Services.id), (0, drizzle_orm_1.eq)(bid_schema_1.Bids.mechanic_id, mechanicId))))))
        .groupBy(service_schema_1.Services.id, user_profiles_schema_1.UserProfiles.id, user_schema_1.Users.id, service_progress_schema_1.ServiceProgress.id)
        .orderBy((0, drizzle_orm_1.desc)(service_schema_1.Services.created_at));
    console.log(data);
    const raw = data.map((service) => ({
        service: service.service,
        user: Object.assign(Object.assign(Object.assign({}, service.user_details), service.user_profile_details), { avg_rating: Number(Number(service.average_rating).toFixed(1)) }),
    }));
    const scheduled = raw.filter((x) => x.service.is_scheduled === true);
    const not_scheduled = raw.filter((x) => x.service.is_scheduled === false);
    return {
        scheduled,
        not_scheduled,
    };
});
const getServiceDetails = (s_id) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield db_1.db
        .select({
        service: {
            id: service_schema_1.Services.id,
            issue: service_schema_1.Services.issue,
            description: service_schema_1.Services.description,
            coordinates: service_schema_1.Services.coordinates,
            created_at: service_schema_1.Services.created_at,
            user_id: service_schema_1.Services.user_id,
            address: service_schema_1.Services.address,
        },
        user_profile: {
            full_name: user_profiles_schema_1.UserProfiles.full_name,
            address: user_profiles_schema_1.UserProfiles.address,
            mobile: user_profiles_schema_1.UserProfiles.mobile,
            image: user_profiles_schema_1.UserProfiles.image,
        },
        car_data: {
            car_name: user_carinfo_schema_1.UserCars.car_name,
            car_model: user_carinfo_schema_1.UserCars.car_model,
        },
    })
        .from(service_schema_1.Services)
        .leftJoin(user_profiles_schema_1.UserProfiles, (0, drizzle_orm_1.eq)(user_profiles_schema_1.UserProfiles.user_id, service_schema_1.Services.user_id))
        .leftJoin(user_carinfo_schema_1.UserCars, (0, drizzle_orm_1.eq)(user_carinfo_schema_1.UserCars.user_id, service_schema_1.Services.user_id))
        .where((0, drizzle_orm_1.eq)(service_schema_1.Services.id, s_id))
        .limit(1);
    const avgResult = yield helper_repository_1.Repository.getAvgRatingOfAUser(service[0].service.user_id);
    return Object.assign(Object.assign({}, service[0]), { rating: {
            avg_rating: Number(Number(avgResult[0].avg_rating).toFixed(1)),
            total: Number(avgResult[0].total_ratings),
        } });
});
//================== common ======================
const runningServiceDetails = (s_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    const data = yield db_1.db.query.ServiceProgress.findFirst({
        where: (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_id, s_id),
        columns: {
            extra_issue: true,
            extra_price: true,
            is_scheduled: true,
            extra_issue_description: true,
            service_status: true,
        },
        with: {
            bid_data: {
                columns: { id: true, price: true },
                with: {
                    mechanic: {
                        columns: { full_name: true, image: true, mobile: true },
                        with: {
                            user: { columns: { email: true, role: true, id: true } },
                            work_shop: {
                                columns: { coordinates: true, location_name: true },
                            },
                        },
                    },
                },
            },
            service_data: {
                columns: {
                    id: true,
                    issue: true,
                    description: true,
                    scheduled_date: true,
                    coordinates: true,
                },
                with: {
                    user: {
                        columns: { full_name: true, image: true, mobile: true },
                        with: { user: { columns: { email: true, role: true, id: true } } },
                    },
                },
            },
        },
    });
    if (!data)
        return null;
    const mechanicId = (_b = (_a = data.bid_data) === null || _a === void 0 ? void 0 : _a.mechanic.user) === null || _b === void 0 ? void 0 : _b.id;
    const userId = (_d = (_c = data.service_data) === null || _c === void 0 ? void 0 : _c.user.user) === null || _d === void 0 ? void 0 : _d.id;
    const [mechanic_rating, user_rating] = yield Promise.all([
        mechanicId ? helper_repository_1.Repository.getAvgRatingOfAMechanic(mechanicId) : null,
        userId ? helper_repository_1.Repository.getAvgRatingOfAUser(userId) : null,
    ]);
    const formatRating = (ratingArray) => (ratingArray === null || ratingArray === void 0 ? void 0 : ratingArray[0])
        ? {
            avg_rating: Math.round(Number(ratingArray[0].avg_rating || 0) * 10) / 10,
            total_ratings: Number(ratingArray[0].total_ratings) || 0,
        }
        : { avg_rating: 0, total_ratings: 0 };
    return {
        service_data: {
            id: ((_e = data.service_data) === null || _e === void 0 ? void 0 : _e.id) || null,
            issue: ((_f = data.service_data) === null || _f === void 0 ? void 0 : _f.issue) || null,
            description: ((_g = data.service_data) === null || _g === void 0 ? void 0 : _g.description) || null,
            scheduled_date: ((_h = data.service_data) === null || _h === void 0 ? void 0 : _h.scheduled_date) || null,
            coordinates: ((_j = data.service_data) === null || _j === void 0 ? void 0 : _j.coordinates) || null,
            is_scheduled: data.is_scheduled,
            service_status: data.service_status,
            extra_issue: data.extra_issue,
            extra_issue_description: data.extra_issue_description,
            extra_price: Number(data.extra_price),
        },
        user_data: {
            full_name: ((_k = data.service_data) === null || _k === void 0 ? void 0 : _k.user.full_name) || null,
            image: ((_l = data.service_data) === null || _l === void 0 ? void 0 : _l.user.image) || null,
            mobile: ((_m = data.service_data) === null || _m === void 0 ? void 0 : _m.user.mobile) || null,
            email: ((_p = (_o = data.service_data) === null || _o === void 0 ? void 0 : _o.user.user) === null || _p === void 0 ? void 0 : _p.email) || null,
            role: ((_r = (_q = data.service_data) === null || _q === void 0 ? void 0 : _q.user.user) === null || _r === void 0 ? void 0 : _r.role) || null,
            rating: formatRating(user_rating),
        },
        mechanic_data: {
            full_name: ((_s = data.bid_data) === null || _s === void 0 ? void 0 : _s.mechanic.full_name) || null,
            image: ((_t = data.bid_data) === null || _t === void 0 ? void 0 : _t.mechanic.image) || null,
            mobile: ((_u = data.bid_data) === null || _u === void 0 ? void 0 : _u.mechanic.mobile) || null,
            email: ((_w = (_v = data.bid_data) === null || _v === void 0 ? void 0 : _v.mechanic.user) === null || _w === void 0 ? void 0 : _w.email) || null,
            role: ((_y = (_x = data.bid_data) === null || _x === void 0 ? void 0 : _x.mechanic.user) === null || _y === void 0 ? void 0 : _y.role) || null,
            work_shop_coordinates: ((_0 = (_z = data.bid_data) === null || _z === void 0 ? void 0 : _z.mechanic.work_shop) === null || _0 === void 0 ? void 0 : _0.coordinates) || null,
            work_shop_name: ((_2 = (_1 = data.bid_data) === null || _1 === void 0 ? void 0 : _1.mechanic.work_shop) === null || _2 === void 0 ? void 0 : _2.location_name) || null,
            rating: formatRating(mechanic_rating),
        },
        bid_data: {
            bid_id: ((_3 = data.bid_data) === null || _3 === void 0 ? void 0 : _3.id) || null,
            bid_price: Number((_4 = data.bid_data) === null || _4 === void 0 ? void 0 : _4.price) || null,
        },
    };
});
//Other-====================
const getServiceProgressById = (sp_id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db.query.ServiceProgress.findFirst({
        where: (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.id, sp_id),
    });
    return data;
});
exports.ServiceRepository = {
    makeServiceReq,
    makeServiceProgres,
    getAvailableServicesForMechanic,
    getServiceProgressById,
    getServiceDetails,
    runningServiceDetails,
};
