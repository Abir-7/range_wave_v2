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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSendHandler = void 0;
const chat_repository_1 = require("./../../../repositories/chat.repository");
const radis_1 = __importDefault(require("../../radis"));
const getSocketsByUser_1 = require("../helper/getSocketsByUser");
const messageSendHandler = (io, socket) => {
    socket.on("message:send", (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { room_id, receiver_id } = data, other = __rest(data, ["room_id", "receiver_id"]);
            const sender_id = socket.data.user_id;
            // 1️⃣ Create temporary message for instant UI
            const tempMessage = Object.assign(Object.assign({ id: `temp-${Date.now()}`, sender_id,
                room_id }, other), { created_at: new Date(), status: "sending" });
            // 2️⃣ Emit immediately to sender and room
            socket.emit("message:sent", tempMessage);
            socket.to(`room:${room_id}`).emit("message:new", tempMessage);
            // 3️⃣ Check if recipient is currently in the room
            const receiverSockets = yield (0, getSocketsByUser_1.getSocketsByUser)(receiver_id);
            let isInRoom = false;
            for (const sid of receiverSockets) {
                const socketInstance = io.sockets.sockets.get(sid);
                const rooms = socketInstance === null || socketInstance === void 0 ? void 0 : socketInstance.rooms;
                if (rooms === null || rooms === void 0 ? void 0 : rooms.has(`room:${room_id}`)) {
                    isInRoom = true;
                    break;
                }
            }
            // 4️⃣ Increment unread count and emit chat list update if recipient not in room
            if (!isInRoom) {
                const unread = yield radis_1.default.incr(`unread:${room_id}:${receiver_id}`);
                for (const sid of receiverSockets) {
                    const socketInstance = io.sockets.sockets.get(sid);
                    if (!socketInstance)
                        continue;
                    socketInstance.emit("chatlist:unread_update", {
                        room_id,
                        unread_count: unread,
                        last_message: tempMessage.message,
                        last_message_time: tempMessage.created_at,
                    });
                }
            }
            // 5️⃣ Save message to DB asynchronously
            const savedMessage = yield chat_repository_1.ChatRepository.saveMessage(Object.assign({ sender_id }, other), room_id);
            // 6️⃣ Emit confirmed message with DB ID
            socket.emit("message:confirmed", savedMessage);
            socket.to(`room:${room_id}`).emit("message:confirmed", savedMessage);
            ack === null || ack === void 0 ? void 0 : ack({ ok: true });
        }
        catch (err) {
            ack === null || ack === void 0 ? void 0 : ack({ ok: false, error: err.message });
        }
    }));
};
exports.messageSendHandler = messageSendHandler;
