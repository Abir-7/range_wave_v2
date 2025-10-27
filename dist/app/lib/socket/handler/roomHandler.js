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
exports.roomHandler = void 0;
const radis_1 = __importDefault(require("../../radis"));
const roomHandler = (io, socket) => {
    // Join a one-to-one chat room
    socket.on("room:join", (_a) => __awaiter(void 0, [_a], void 0, function* ({ room_id }) {
        socket.join(`room:${room_id}`);
        console.log(`User ${socket.data.user_id} joined room ${room_id}`);
        // Clear unread messages when joining
        yield radis_1.default.del(`unread:${room_id}:${socket.data.user_id}`);
    }));
    // Leave room
    socket.on("room:leave", ({ room_id }) => {
        socket.leave(`room:${room_id}`);
        console.log(`User ${socket.data.user_id} left room ${room_id}`);
    });
};
exports.roomHandler = roomHandler;
