"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = void 0;
const disconnectHandler_1 = require("./handler/disconnectHandler");
const registerSocketHandlers = (io, socket) => {
    (0, disconnectHandler_1.disconnectHandler)(io, socket);
};
exports.registerSocketHandlers = registerSocketHandlers;
