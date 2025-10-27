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
exports.consumeQueue = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const logger_1 = require("../../utils/serverTools/logger");
const _1 = require(".");
const consumeQueue = (queueName_1, handler_1, ...args_1) => __awaiter(void 0, [queueName_1, handler_1, ...args_1], void 0, function* (queueName, handler, prefetch = 5) {
    try {
        const channel = yield (0, _1.getChannel)(queueName);
        channel.prefetch(prefetch);
        logger_1.logger.info(`Waiting for messages in ${queueName}`);
        channel.consume(queueName, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if (!msg)
                return;
            console.log("Raw message buffer:", msg.content); // Buffer
            const str = msg.content.toString();
            console.log("Raw message string:", str);
            let data;
            try {
                data = JSON.parse(str);
            }
            catch (err) {
                logger_1.logger.error("Failed to parse message JSON:", str);
                channel.nack(msg, false, false); // discard bad message
                return;
            }
            console.log("Parsed data object:", data); // Should be your object
            try {
                yield handler(data);
                channel.ack(msg);
            }
            catch (error) {
                logger_1.logger.error(`Error processing ${queueName}: ${error.message}`);
                channel.nack(msg, false, true);
            }
        }), { noAck: false });
    }
    catch (error) {
        logger_1.logger.error(`Failed to consume queue ${queueName}: ${error.message}`);
        throw error;
    }
});
exports.consumeQueue = consumeQueue;
