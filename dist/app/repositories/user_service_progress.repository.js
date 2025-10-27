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
exports.ServiceProgressRepository = void 0;
const service_progress_schema_1 = require("../schema/service_flow/progress/service_progress.schema");
const db_1 = require("../db");
const drizzle_orm_1 = require("drizzle-orm");
const given_by_user_schema_1 = require("../schema/rating/given_by_user/given_by_user.schema");
const given_by_mechanic_schema_1 = require("../schema/rating/given_by_mechanic/given_by_mechanic.schema");
const user_profiles_schema_1 = require("../schema/user/user_profiles.schema");
const pg_core_1 = require("drizzle-orm/pg-core");
const service_schema_1 = require("../schema/service_flow/service/service.schema");
const bid_schema_1 = require("../schema/service_flow/bid/bid.schema");
const updateServiceProgress = (data, service_id, service_progress_id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const orConditions = [];
    if (service_id) {
        orConditions.push((0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_id, service_id));
    }
    if (service_progress_id) {
        orConditions.push((0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.id, service_progress_id));
    }
    if (orConditions.length === 0) {
        throw new Error("At least one identifier must be provided");
    }
    const [updated] = yield client
        .update(service_progress_schema_1.ServiceProgress)
        .set(Object.assign(Object.assign({}, data), { updated_at: new Date() }))
        .where((0, drizzle_orm_1.or)(...orConditions)) // <-- any one can match
        .returning();
    return updated;
});
const findServiceProgressData = (s_id, sp_id) => __awaiter(void 0, void 0, void 0, function* () {
    let whereClause;
    if (s_id) {
        whereClause = (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_id, s_id);
    }
    else if (sp_id) {
        whereClause = (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.id, sp_id);
    }
    else {
        throw new Error("Either service_id or service_progress_id must be provided");
    }
    return yield db_1.db.query.ServiceProgress.findFirst({
        where: whereClause,
        with: {
            bid_data: {
                columns: { price: true, mechanic_id: true },
            },
        },
    });
});
const getUsersRunningProgress = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    // Allowed running statuses
    const runningStatuses = [
        "FINDING",
        "ON_THE_WAY",
        "WORKING",
        "NEED_TO_PAY",
    ];
    // Query latest service with its progress
    const result = yield db_1.db
        .select({
        service_id: service_progress_schema_1.ServiceProgress.service_id,
        created_at: service_progress_schema_1.ServiceProgress.created_at,
        updated_at: service_progress_schema_1.ServiceProgress.updated_at,
    })
        .from(service_progress_schema_1.ServiceProgress)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.user_id, user_id), (0, drizzle_orm_1.inArray)(service_progress_schema_1.ServiceProgress.service_status, runningStatuses)))
        .orderBy((0, drizzle_orm_1.desc)(service_progress_schema_1.ServiceProgress.updated_at))
        .limit(1);
    return result[0] || null;
});
const getMechanicsRunningProgress = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    // Allowed running statuses
    const runningStatuses = ["ON_THE_WAY", "WORKING", "NEED_TO_PAY"];
    // Query latest service with its progress
    const result = yield db_1.db
        .select({
        service_id: service_progress_schema_1.ServiceProgress.service_id,
        created_at: service_progress_schema_1.ServiceProgress.created_at,
        updated_at: service_progress_schema_1.ServiceProgress.updated_at,
    })
        .from(service_progress_schema_1.ServiceProgress)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.mechanic_id, mechanic_id), (0, drizzle_orm_1.inArray)(service_progress_schema_1.ServiceProgress.service_status, runningStatuses)))
        .orderBy((0, drizzle_orm_1.desc)(service_progress_schema_1.ServiceProgress.updated_at))
        .limit(1);
    return result[0] || null;
});
const getUsersAllRunningServiceProgress = (status, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.db
        .select({
        // bid_id: ServiceProgress.bid_id,
        // extra_issue: ServiceProgress.extra_issue,
        // extra_issue_description: ServiceProgress.extra_issue_description,
        extra_price: service_progress_schema_1.ServiceProgress.extra_price,
        service_status: service_progress_schema_1.ServiceProgress.service_status,
        is_scheduled: service_progress_schema_1.ServiceProgress.is_scheduled,
        updated_at: service_progress_schema_1.ServiceProgress.updated_at,
        user_avg_rating: (0, drizzle_orm_1.sql) `COALESCE(${userAvgRatingSubquery.user_avg_rating}, 0)`,
        mechanic_avg_rating: (0, drizzle_orm_1.sql) `COALESCE(${mechanicAvgRatingSubquery.mechanic_avg_rating}, 0)`,
        user_profile: {
            user_id: userProfile.user_id,
            full_name: userProfile.full_name,
            image: userProfile.image,
            mobile: userProfile.mobile,
        },
        service: {
            id: service_schema_1.Services.id,
            //  user_id: Services.user_id,
            issue: service_schema_1.Services.issue,
            description: service_schema_1.Services.description,
            //    scheduled_date: Services.scheduled_date,
            //   address: Services.address,
            //    coordinates: Services.coordinates,
            // created_at: Services.created_at,
            // updated_at: Services.updated_at,
            // deleted_at: Services.deleted_at,
        },
        bid: {
            id: bid_schema_1.Bids.id,
            // service_id: Bids.service_id,
            //  mechanic_id: Bids.mechanic_id,
            price: bid_schema_1.Bids.price,
            // status: Bids.status,
            // created_at: Bids.created_at,
            // updated_at: Bids.updated_at,
            // deleted_at: Bids.deleted_at,
        },
        mechanic_profile: {
            user_id: mechanicProfile.user_id,
            full_name: mechanicProfile.full_name,
            image: mechanicProfile.image,
            mobile: mechanicProfile.mobile,
        },
    })
        .from(service_progress_schema_1.ServiceProgress)
        .leftJoin(userProfile, (0, drizzle_orm_1.eq)(userProfile.user_id, service_progress_schema_1.ServiceProgress.user_id))
        .leftJoin(mechanicProfile, (0, drizzle_orm_1.eq)(mechanicProfile.user_id, service_progress_schema_1.ServiceProgress.mechanic_id))
        .leftJoin(service_schema_1.Services, (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_id, service_schema_1.Services.id))
        .leftJoin(bid_schema_1.Bids, (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.bid_id, bid_schema_1.Bids.id))
        .leftJoin(userAvgRatingSubquery, (0, drizzle_orm_1.eq)(userAvgRatingSubquery.user_id, service_progress_schema_1.ServiceProgress.user_id))
        .leftJoin(mechanicAvgRatingSubquery, (0, drizzle_orm_1.eq)(mechanicAvgRatingSubquery.mechanic_id, service_progress_schema_1.ServiceProgress.mechanic_id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.user_id, user_id), (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_status, status)))
        .orderBy((0, drizzle_orm_1.desc)(service_progress_schema_1.ServiceProgress.updated_at));
    return result;
});
const getMechanicsAllRunningServiceProgress = (status, mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.db
        .select({
        // bid_id: ServiceProgress.bid_id,
        // extra_issue: ServiceProgress.extra_issue,
        // extra_issue_description: ServiceProgress.extra_issue_description,
        extra_price: service_progress_schema_1.ServiceProgress.extra_price,
        service_status: service_progress_schema_1.ServiceProgress.service_status,
        is_scheduled: service_progress_schema_1.ServiceProgress.is_scheduled,
        updated_at: service_progress_schema_1.ServiceProgress.updated_at,
        user_avg_rating: (0, drizzle_orm_1.sql) `COALESCE(${userAvgRatingSubquery.user_avg_rating}, 0)`,
        mechanic_avg_rating: (0, drizzle_orm_1.sql) `COALESCE(${mechanicAvgRatingSubquery.mechanic_avg_rating}, 0)`,
        user_profile: {
            user_id: userProfile.user_id,
            full_name: userProfile.full_name,
            image: userProfile.image,
            mobile: userProfile.mobile,
        },
        service: {
            id: service_schema_1.Services.id,
            //  user_id: Services.user_id,
            issue: service_schema_1.Services.issue,
            description: service_schema_1.Services.description,
            //    scheduled_date: Services.scheduled_date,
            //   address: Services.address,
            //    coordinates: Services.coordinates,
            // created_at: Services.created_at,
            // updated_at: Services.updated_at,
            // deleted_at: Services.deleted_at,
        },
        bid: {
            id: bid_schema_1.Bids.id,
            // service_id: Bids.service_id,
            //  mechanic_id: Bids.mechanic_id,
            price: bid_schema_1.Bids.price,
            // status: Bids.status,
            // created_at: Bids.created_at,
            // updated_at: Bids.updated_at,
            // deleted_at: Bids.deleted_at,
        },
        mechanic_profile: {
            user_id: mechanicProfile.user_id,
            full_name: mechanicProfile.full_name,
            image: mechanicProfile.image,
            mobile: mechanicProfile.mobile,
        },
    })
        .from(service_progress_schema_1.ServiceProgress)
        .leftJoin(userProfile, (0, drizzle_orm_1.eq)(userProfile.user_id, service_progress_schema_1.ServiceProgress.user_id))
        .leftJoin(mechanicProfile, (0, drizzle_orm_1.eq)(mechanicProfile.user_id, service_progress_schema_1.ServiceProgress.mechanic_id))
        .leftJoin(service_schema_1.Services, (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_id, service_schema_1.Services.id))
        .leftJoin(bid_schema_1.Bids, (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.bid_id, bid_schema_1.Bids.id))
        .leftJoin(userAvgRatingSubquery, (0, drizzle_orm_1.eq)(userAvgRatingSubquery.user_id, service_progress_schema_1.ServiceProgress.user_id))
        .leftJoin(mechanicAvgRatingSubquery, (0, drizzle_orm_1.eq)(mechanicAvgRatingSubquery.mechanic_id, service_progress_schema_1.ServiceProgress.mechanic_id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.mechanic_id, mechanic_id), (0, drizzle_orm_1.eq)(service_progress_schema_1.ServiceProgress.service_status, status)))
        .orderBy((0, drizzle_orm_1.desc)(service_progress_schema_1.ServiceProgress.updated_at));
    return result;
});
exports.ServiceProgressRepository = {
    updateServiceProgress,
    findServiceProgressData,
    getMechanicsRunningProgress,
    getUsersRunningProgress,
    getMechanicsAllRunningServiceProgress,
    getUsersAllRunningServiceProgress,
};
// ====================== SubQuery =============================
// Mechanic’s average rating (rated by users)
// Mechanic’s average rating (rated by users)
const mechanicAvgRatingSubquery = db_1.db
    .select({
    mechanic_id: given_by_user_schema_1.RatingByUser.mechanic_id,
    mechanic_avg_rating: (0, drizzle_orm_1.sql) `ROUND(AVG(${given_by_user_schema_1.RatingByUser.rating})::numeric, 2)`.as("mechanic_avg_rating"),
})
    .from(given_by_user_schema_1.RatingByUser)
    .groupBy(given_by_user_schema_1.RatingByUser.mechanic_id)
    .as("mechanic_avg_rating");
// User’s average rating (rated by mechanics)
const userAvgRatingSubquery = db_1.db
    .select({
    user_id: given_by_mechanic_schema_1.RatingByMechanic.user_id,
    user_avg_rating: (0, drizzle_orm_1.sql) `ROUND(AVG(${given_by_mechanic_schema_1.RatingByMechanic.rating})::numeric, 2)`.as("user_avg_rating"),
})
    .from(given_by_mechanic_schema_1.RatingByMechanic)
    .groupBy(given_by_mechanic_schema_1.RatingByMechanic.user_id)
    .as("user_avg_rating");
// Create aliases for user & mechanic
const userProfile = (0, pg_core_1.alias)(user_profiles_schema_1.UserProfiles, "user_profile");
const mechanicProfile = (0, pg_core_1.alias)(user_profiles_schema_1.UserProfiles, "mechanic_profile");
