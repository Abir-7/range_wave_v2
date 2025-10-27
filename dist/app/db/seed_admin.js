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
exports.seedAdmin = seedAdmin;
const drizzle_orm_1 = require("drizzle-orm");
const _1 = require(".");
const user_schema_1 = require("../schema/user/user.schema");
const getHashedPassword_1 = __importDefault(require("../utils/helper/getHashedPassword"));
const logger_1 = require("../utils/serverTools/logger");
const appConfig_1 = require("../config/appConfig");
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = appConfig_1.appConfig.admin.email;
            const password = appConfig_1.appConfig.admin.password;
            const existing = yield _1.db
                .select()
                .from(user_schema_1.Users)
                .where((0, drizzle_orm_1.eq)(user_schema_1.Users.email, email));
            if (existing) {
                console.log("Admin already exists");
                return;
            }
            const password_hash = yield (0, getHashedPassword_1.default)(password);
            yield _1.db
                .insert(user_schema_1.Users)
                .values({
                email,
                password_hash,
                role: "super_admin",
                is_verified: true,
                status: "active",
            })
                .returning();
            logger_1.logger.info("Admin created:");
        }
        catch (err) {
            logger_1.logger.error("Error seeding admin:", err);
        }
    });
}
