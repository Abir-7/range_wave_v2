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
exports.RatingRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const given_by_mechanic_schema_1 = require("../schema/rating/given_by_mechanic/given_by_mechanic.schema");
const helper_repository_1 = require("./helper.repository");
const given_by_user_schema_1 = require("../schema/rating/given_by_user/given_by_user.schema");
const ratingGivenByMechanic = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [rating_data] = yield db_1.db
        .insert(given_by_mechanic_schema_1.RatingByMechanic)
        .values(data)
        .returning();
    return rating_data;
});
const ratingGivenByUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [rating_data] = yield db_1.db.insert(given_by_user_schema_1.RatingByUser).values(data).returning();
    return rating_data;
});
const getUserRatingData = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const ratings = yield db_1.db.query.RatingByMechanic.findMany({
        where: (0, drizzle_orm_1.eq)(given_by_mechanic_schema_1.RatingByMechanic.user_id, user_id),
        columns: {
            rating: true,
            text: true,
            //  mechanic_id: true,
            created_at: true,
        },
        with: {
            mechanic: {
                columns: {
                    full_name: true,
                    mobile: true,
                    image: true,
                    user_id: true,
                },
            },
        },
    });
    const avgResult = yield helper_repository_1.Repository.getAvgRatingOfAUser(user_id);
    return {
        ratings,
        avg_rating: Number(Number(avgResult[0].avg_rating).toFixed(1)),
        total: Number(avgResult[0].total_ratings),
    };
});
const getMechanicRatingData = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    const ratings = yield db_1.db.query.RatingByUser.findMany({
        where: (0, drizzle_orm_1.eq)(given_by_user_schema_1.RatingByUser.mechanic_id, mechanic_id),
        columns: { created_at: true, rating: true, text: true },
        with: {
            user: {
                columns: {
                    full_name: true,
                    mobile: true,
                    image: true,
                    user_id: true,
                },
            },
        },
    });
    const avgResult = yield helper_repository_1.Repository.getAvgRatingOfAMechanic(mechanic_id);
    return {
        ratings,
        avg_rating: Number(Number(avgResult[0].avg_rating).toFixed(1)),
        total: Number(avgResult[0].total_ratings),
    };
});
exports.RatingRepository = {
    ratingGivenByMechanic,
    getUserRatingData,
    getMechanicRatingData,
    ratingGivenByUser,
};
