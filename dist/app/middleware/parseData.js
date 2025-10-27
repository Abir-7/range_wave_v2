"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDataField = void 0;
const AppError_1 = require("../utils/serverTools/AppError");
const parseDataField = (fieldName) => (req, res, next) => {
    try {
        if (req.body[fieldName]) {
            req.body = JSON.parse(req.body[fieldName]);
            next();
        }
        else {
            next();
        }
    }
    catch (error) {
        throw new AppError_1.AppError("Invalid JSON string", 500);
    }
};
exports.parseDataField = parseDataField;
