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
exports.Repository = void 0;
const db_1 = require("../db");
const given_by_mechanic_schema_1 = require("../schema/rating/given_by_mechanic/given_by_mechanic.schema");
const drizzle_orm_1 = require("drizzle-orm");
const given_by_user_schema_1 = require("../schema/rating/given_by_user/given_by_user.schema");
const transaction = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield callback(tx);
    }));
});
const getAvgRatingOfAUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db
        .select({
        avg_rating: (0, drizzle_orm_1.sql) `COALESCE(AVG(${given_by_mechanic_schema_1.RatingByMechanic.rating}), 0)`.as("avg_rating"),
        total_ratings: (0, drizzle_orm_1.sql) `COUNT(${given_by_mechanic_schema_1.RatingByMechanic.id})`.as("total_ratings"),
    })
        .from(given_by_mechanic_schema_1.RatingByMechanic)
        .where((0, drizzle_orm_1.eq)(given_by_mechanic_schema_1.RatingByMechanic.user_id, user_id));
});
const getAvgRatingOfAMechanic = (mechanic_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db
        .select({
        avg_rating: (0, drizzle_orm_1.sql) `COALESCE(AVG(${given_by_user_schema_1.RatingByUser.rating}), 0)`.as("avg_rating"),
        total_ratings: (0, drizzle_orm_1.sql) `COUNT(${given_by_user_schema_1.RatingByUser.id})`.as("total_ratings"),
    })
        .from(given_by_user_schema_1.RatingByUser)
        .where((0, drizzle_orm_1.eq)(given_by_user_schema_1.RatingByUser.mechanic_id, mechanic_id));
});
exports.Repository = {
    transaction,
    getAvgRatingOfAUser,
    getAvgRatingOfAMechanic,
};
