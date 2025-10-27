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
exports.getSocket = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const radis_1 = __importDefault(require("../radis"));
const appConfig_1 = require("../../config/appConfig");
const jwt_1 = require("../../utils/jwt/jwt");
const logger_1 = require("../../utils/serverTools/logger");
const socketManager_1 = require("./socketManager");
let io;
const JWT_SECRET = appConfig_1.appConfig.jwt.jwt_access_secret;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
            if (!token)
                throw new Error("No token provided");
            const payload = jwt_1.jsonWebToken.verifyJwt(token, JWT_SECRET);
            socket.data.user_id = payload.user_id;
            yield radis_1.default.sadd(`user:${payload.user_id}`, socket.id);
            next();
        }
        catch (err) {
            logger_1.logger.error("❌ Socket auth failed:", err.message);
            next(new Error("Unauthorized"));
        }
    }));
    io.on("connection", (socket) => {
        logger_1.logger.info(`✅ User connected: ${socket.data.user_id}`);
        (0, socketManager_1.registerSocketHandlers)(io, socket);
    });
    return io;
};
exports.initSocket = initSocket;
const getSocket = () => {
    if (!io)
        throw new Error("Socket.IO not initialized yet.");
    return io;
};
exports.getSocket = getSocket;
