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
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const appConfig_1 = require("./app/config/appConfig");
const logger_1 = require("./app/utils/serverTools/logger");
const worker_1 = require("./app/lib/rabbitMq/worker");
const db_1 = require("./app/db");
const radis_1 = __importDefault(require("./app/lib/radis"));
const socket_1 = require("./app/lib/socket");
const seed_admin_1 = require("./app/db/seed_admin");
// Create HTTP server
const server = http_1.default.createServer(app_1.default);
// Start server
server.listen(appConfig_1.appConfig.server.port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`🚀 Server running in ${appConfig_1.appConfig.server.node_env} mode on port ${appConfig_1.appConfig.server.port}`);
        yield db_1.db.execute("select 1").then(() => logger_1.logger.info("Database connected."));
        yield (0, worker_1.startConsumers)(); // start RabbitMQ consumers
        (0, socket_1.initSocket)(server);
        yield (0, seed_admin_1.seedAdmin)();
    }
    catch (err) {
        logger_1.logger.error("Error during server startup:", err);
        process.exit(1); // exit if startup fails
    }
}));
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger_1.logger.error("UNHANDLED REJECTION! Shutting down...", reason);
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    logger_1.logger.error("UNCAUGHT EXCEPTION! Shutting down...", err);
    process.exit(1);
});
//redis
radis_1.default.on("connect", () => {
    logger_1.logger.info("Redis connected");
});
radis_1.default.on("error", (err) => {
    logger_1.logger.error("Redis error:", err);
});
