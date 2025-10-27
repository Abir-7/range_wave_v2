"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePostgresError = exports.globalErrorHandler = void 0;
const AppError_1 = require("../../utils/serverTools/AppError");
const zod_1 = require("zod");
const drizzle_orm_1 = require("drizzle-orm");
const globalErrorHandler = (err, // accept anything thrown
req, res, next) => {
    let status_code = 500;
    let message = "Internal Server Error";
    let errors = [];
    // Handle AppError
    if (err instanceof AppError_1.AppError) {
        status_code = err.status_code;
        message = err.message;
        errors.push({ path: "", message: err.message });
    }
    // Handle Zod validation errors
    else if (err instanceof zod_1.ZodError) {
        status_code = 400;
        message = "Validation Error";
        errors = err.issues.map((issue) => ({
            path: issue.path.join(".") || "",
            message: issue.message,
        }));
    }
    else if (err instanceof drizzle_orm_1.DrizzleQueryError) {
        const pgError = err.cause;
        console.log(pgError === null || pgError === void 0 ? void 0 : pgError.code);
        switch (pgError === null || pgError === void 0 ? void 0 : pgError.code) {
            case "23505": {
                // duplicate key error
                const fieldMsg = (0, exports.parsePostgresError)(pgError.detail);
                status_code = 400;
                message = fieldMsg || "Duplicate entry already exists.";
                break;
            }
            case "23503":
                status_code = 400;
                message = "Invalid reference — foreign key constraint failed.";
                break;
            case "23502":
                status_code = 400;
                message = "Missing required field.";
                break;
            default:
                message = (pgError === null || pgError === void 0 ? void 0 : pgError.message) || "Database query failed.";
                break;
        }
        errors.push({ path: "", message: message || message });
    }
    // Handle any other Error instance
    else if (err instanceof Error) {
        console.log("hit2");
        message = err.message || message;
        errors.push({ path: "", message: err.message || message });
    }
    // Handle unknown non-Error throwables
    else {
        message = "Something went wrong. Try again.";
        errors.push({ path: "", message: String(err) || message });
    }
    // Send structured response
    res.status(status_code).json(Object.assign({ success: false, status_code: status_code, message,
        errors }, (process.env.NODE_ENV === "development" &&
        err instanceof Error && { stack: err.stack })));
};
exports.globalErrorHandler = globalErrorHandler;
const parsePostgresError = (detail) => {
    if (!detail)
        return null;
    // Example: Key (email)=(abir@gmail.com) already exists.
    const match = detail.match(/\((.*?)\)=/);
    if (match && match[1]) {
        return `${match[1]} already exists`;
    }
    return detail; // fallback
};
exports.parsePostgresError = parsePostgresError;
