"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const appConfig_1 = require("../../config/appConfig");
const formatMessage = (level, message) => {
    const timestamp = new Date().toISOString();
    const colors = {
        info: chalk_1.default.cyan.bold(`[INFO]`),
        warn: chalk_1.default.yellow.bold(`[WARN]`),
        error: chalk_1.default.red.bold(`[ERROR]`),
        debug: chalk_1.default.magenta.bold(`[DEBUG]`),
    };
    return `${chalk_1.default.gray(`[${timestamp}]`)} ${colors[level]} ${message}`;
};
exports.logger = {
    info: (msg) => console.log(formatMessage("info", msg)),
    warn: (msg) => console.warn(formatMessage("warn", msg)),
    error: (msg, err) => {
        console.error(formatMessage("error", msg));
        if (err instanceof Error && appConfig_1.appConfig.server.node_env === "development") {
            console.error(chalk_1.default.gray(err.stack));
        }
    },
    debug: (msg) => {
        if (appConfig_1.appConfig.server.node_env === "development") {
            console.log(formatMessage("debug", msg));
        }
    },
};
