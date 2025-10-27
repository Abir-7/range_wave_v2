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
exports.ChatService = void 0;
const chat_repository_1 = require("../repositories/chat.repository");
const getChatlist = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "mechanic") {
        return (yield chat_repository_1.ChatRepository.getMechanicsChatList(id)) || [];
    }
    if (role === "user") {
        return (yield chat_repository_1.ChatRepository.getUsersChatList(id)) || [];
    }
    return [];
});
const getAllMessage = (chat_room_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield chat_repository_1.ChatRepository.getAllMessage(chat_room_id);
});
exports.ChatService = { getChatlist, getAllMessage };
