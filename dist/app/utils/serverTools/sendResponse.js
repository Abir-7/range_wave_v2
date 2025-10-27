"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.status_code).send({
        success: data.success,
        message: data.message,
        status_code: data.status_code,
        data: data.data,
        meta: data.meta,
    });
};
exports.default = sendResponse;
