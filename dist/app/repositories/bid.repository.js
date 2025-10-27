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
exports.BidRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const bid_schema_1 = require("../schema/service_flow/bid/bid.schema");
const service_schema_1 = require("../schema/service_flow/service/service.schema");
const user_profiles_schema_1 = require("../schema/user/user_profiles.schema");
const user_schema_1 = require("../schema/user/user.schema");
const service_progress_schema_1 = require("../schema/service_flow/progress/service_progress.schema");
const given_by_mechanic_schema_1 = require("../schema/rating/given_by_mechanic/given_by_mechanic.schema");
const drizzle_orm_2 = require("drizzle-orm");
const mechanics_workshop_schema_1 = require("../schema/user/mechanics_workshop.schema");
const helper_repository_1 = require("./helper.repository");
const addBid = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [created_bid] = yield db_1.db.insert(bid_schema_1.Bids).values(data).returning();
    return created_bid;
});
const getMechanicBidHistory = (mechanicId) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield db_1.db
        .select({
        service: {
            id: service_schema_1.Services.id,
            issue: service_schema_1.Services.issue,
            description: service_schema_1.Services.description,
            scheduled_date: service_schema_1.Services.scheduled_date,
            created_at: service_schema_1.Services.created_at,
            coordinates: service_schema_1.Services.coordinates,
        },
        progress: {
            is_scheduled: service_progress_schema_1.ServiceProgress.is_scheduled,
        },
        user_profile: {
            full_name: user_profiles_schema_1.UserProfiles.full_name,
            mobile: user_profiles_schema_1.UserProfiles.mobile,
            image: user_profiles_schema_1.UserProfiles.image,
        },
        user: {
            id: user_schema_1.Users.id,
            email: user_schema_1.Users.email,
        },
        average_rating: (0, drizzle_orm_2.sql) `COALESCE(AVG(${given_by_mechanic_schema_1.RatingByMechanic.rating}), 0)`.as("average_rating"),
    })
        .from(bid_schema_1.Bids)
        .innerJoin(service_schema_1.Services, (0, drizzle_orm_1.eq)(service_schema_1.Services.id, bid_schema_1.Bids.service_id))
        .innerJoin(service_progress_schema_1.ServiceProgress, (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_id, service_schema_1.Services.id))
        .leftJoin(user_profiles_schema_1.UserProfiles, (0, drizzle_orm_1.eq)(service_schema_1.Services.user_id, user_profiles_schema_1.UserProfiles.user_id))
        .leftJoin(user_schema_1.Users, (0, drizzle_orm_1.eq)(service_schema_1.Services.user_id, user_schema_1.Users.id))
        .leftJoin(given_by_mechanic_schema_1.RatingByMechanic, (0, drizzle_orm_1.eq)(given_by_mechanic_schema_1.RatingByMechanic.user_id, service_schema_1.Services.user_id))
        .where((0, drizzle_orm_1.eq)(bid_schema_1.Bids.mechanic_id, mechanicId))
        .groupBy(service_schema_1.Services.id, service_progress_schema_1.ServiceProgress.id, user_profiles_schema_1.UserProfiles.id, user_schema_1.Users.id);
    // Shape rows
    const shaped = rows.map((r) => ({
        service: Object.assign(Object.assign({}, r.service), { is_scheduled: r.progress.is_scheduled }),
        user: Object.assign(Object.assign(Object.assign({}, r.user), r.user_profile), { avg_rating: Number(Number(r.average_rating).toFixed(1)) }),
    }));
    // Split to scheduled & not_scheduled
    const scheduled = shaped.filter((x) => x.service.is_scheduled === true);
    const not_scheduled = shaped.filter((x) => x.service.is_scheduled === false);
    return {
        scheduled,
        not_scheduled,
    };
});
//================== user ==================
const getBidListOfaService = (service_id) => __awaiter(void 0, void 0, void 0, function* () {
    const bid_list = yield db_1.db
        .select({
        bid_id: bid_schema_1.Bids.id,
        price: bid_schema_1.Bids.price,
        // mechanic_user_id: Bids.mechanic_id,
        status: bid_schema_1.Bids.status,
        mechanic: {
            user_id: user_profiles_schema_1.UserProfiles.user_id,
            full_name: user_profiles_schema_1.UserProfiles.full_name,
            mobile: user_profiles_schema_1.UserProfiles.mobile,
            image: user_profiles_schema_1.UserProfiles.image,
            coordinates: mechanics_workshop_schema_1.MechanicWorkshop.coordinates,
        },
        avg_rating: (0, drizzle_orm_2.sql) `
        (SELECT AVG(r.rating) 
         FROM rating_by_user r 
         WHERE r.mechanic_id = ${bid_schema_1.Bids.mechanic_id}
        )
      `.as("avg_rating"),
        total_rating: (0, drizzle_orm_2.sql) `
        (SELECT COUNT(r.id) 
         FROM rating_by_user r 
         WHERE r.mechanic_id = ${bid_schema_1.Bids.mechanic_id}
        )
      `.as("total_rating"),
    })
        .from(bid_schema_1.Bids)
        .leftJoin(user_profiles_schema_1.UserProfiles, (0, drizzle_orm_1.eq)(user_profiles_schema_1.UserProfiles.user_id, bid_schema_1.Bids.mechanic_id))
        .leftJoin(mechanics_workshop_schema_1.MechanicWorkshop, (0, drizzle_orm_1.eq)(bid_schema_1.Bids.mechanic_id, mechanics_workshop_schema_1.MechanicWorkshop.user_id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bid_schema_1.Bids.service_id, service_id), (0, drizzle_orm_1.eq)(bid_schema_1.Bids.status, "provided") // example: add more conditions here
    ));
    return bid_list.map((bid) => {
        var _a, _b;
        return (Object.assign(Object.assign({}, bid), { avg_rating: Number((_a = bid.avg_rating) !== null && _a !== void 0 ? _a : 0), total_rating: Number((_b = bid.total_rating) !== null && _b !== void 0 ? _b : 0) }));
    });
});
const getBidDetails = (bid_id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.db.query.Bids.findFirst({
        where: (0, drizzle_orm_1.eq)(bid_schema_1.Bids.id, bid_id),
        columns: {
            service_id: true,
            id: true,
            price: true,
            mechanic_id: true,
            created_at: true,
        },
        with: {
            mechanic: {
                columns: {
                    address: true,
                    full_name: true,
                    image: true,
                    mobile: true,
                    //  user_id: true,
                },
            },
            mechanic_workshop: {
                columns: {
                    //user_id: true,
                    workshop_name: true,
                    services: true,
                    location_name: true,
                    certificates: true,
                    coordinates: true,
                    experiences: true,
                    start_time: true,
                    end_time: true,
                },
            },
        },
    });
    const avgRating = data && data.id
        ? yield helper_repository_1.Repository.getAvgRatingOfAMechanic(data.mechanic_id)
        : null;
    return avgRating
        ? Object.assign(Object.assign({}, data), { rating: {
                avg_rating: Number(Number(avgRating[0].avg_rating).toFixed(1)),
                total_ratings: Number(avgRating[0].total_ratings),
            } }) : {};
});
exports.BidRepository = {
    addBid,
    getMechanicBidHistory,
    getBidListOfaService,
    getBidDetails,
};
