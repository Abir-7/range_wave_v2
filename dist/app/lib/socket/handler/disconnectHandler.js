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
exports.disconnectHandler = void 0;
const radis_1 = __importDefault(require("../../radis"));
const disconnectHandler = (io, socket) => {
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        yield radis_1.default.srem(`user:${socket.data.user_id}`, socket.id);
        const remaining = yield radis_1.default.scard(`user:${socket.data.user_id}`);
        if (remaining === 0)
            yield radis_1.default.del(`user:${socket.data.user_id}`);
        console.log(`❌ User disconnected: ${socket.data.user_id}`);
    }));
};
exports.disconnectHandler = disconnectHandler;
