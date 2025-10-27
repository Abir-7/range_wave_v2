"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isExpired = (exp_date) => {
    if (!exp_date)
        return true; // Treat null as expired
    return new Date() > new Date(exp_date);
};
exports.default = isExpired;
