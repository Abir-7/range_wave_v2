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
exports.publishJob = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const _1 = require(".");
const logger_1 = require("../../utils/serverTools/logger");
const publishJob = (queueName, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channel = yield (0, _1.getChannel)(queueName);
        console.log(payload);
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
            persistent: true,
        });
        logger_1.logger.info(`Job published to ${queueName}`);
    }
    catch (error) {
        logger_1.logger.error(`Failed to publish job to ${queueName}: ${error.message}`);
        throw error;
    }
});
exports.publishJob = publishJob;
