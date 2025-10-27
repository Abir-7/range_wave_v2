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
exports.startConsumers = void 0;
const consumer_1 = require("./consumer");
const sendEmail_1 = require("../../utils/sendEmail");
const logger_1 = require("../../utils/serverTools/logger");
const startConsumers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, consumer_1.consumeQueue)("emailQueue", (job) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Raw job JSON string:", JSON.stringify(job, null, 2));
        const { to, subject, code, project_name, expire_time, purpose } = job;
        logger_1.logger.info(`${code}----`);
        try {
            logger_1.logger.info(`Processing email job: ${to}, ${subject}`);
            yield (0, sendEmail_1.sendEmail)({
                to,
                subject,
                code,
                project_name,
                expire_time,
                purpose,
            });
        }
        catch (error) {
            logger_1.logger.error("Error processing email job:", error);
        }
    }));
});
exports.startConsumers = startConsumers;
