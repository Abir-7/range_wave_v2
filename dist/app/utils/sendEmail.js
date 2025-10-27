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
exports.sendEmail = sendEmail;
/* eslint-disable @typescript-eslint/no-explicit-any */
const nodemailer_1 = __importDefault(require("nodemailer"));
const http_status_1 = __importDefault(require("http-status"));
const appConfig_1 = require("../config/appConfig");
const logger_1 = require("./serverTools/logger");
const AppError_1 = require("./serverTools/AppError");
function sendEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, code, project_name, expire_time = 10, purpose, // default if not provided
     }) {
        try {
            console.log(code, "GG");
            const transporter = nodemailer_1.default.createTransport({
                host: appConfig_1.appConfig.email.host,
                port: Number(appConfig_1.appConfig.email.port),
                secure: false,
                auth: {
                    user: appConfig_1.appConfig.email.user,
                    pass: appConfig_1.appConfig.email.pass,
                },
            });
            const html = `
<html>
<head>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #eef2f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 480px;
      margin: 50px auto;
      padding: 40px 30px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      color: #333333;
    }
    h1 {
      font-size: 26px;
      margin-bottom: 10px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin: 12px 0;
    }
    .code {
      display: inline-block;
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: #ffffff;
      padding: 14px 28px;
      border-radius: 8px;
      margin: 20px 0;
      letter-spacing: 2px;
    }
    .footer {
      margin-top: 25px;
      font-size: 13px;
      color: #888888;
    }
    .footer a {
      color: #888888;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${purpose} Code</h1>
    <p>Use the code below to ${purpose === null || purpose === void 0 ? void 0 : purpose.toLowerCase()} for your <strong>${project_name}</strong> account.</p>
    <div class="code">${code}</div>
    <p>This code expires in ${expire_time} minutes.</p>

  </div>
</body>
</html>
`;
            const info = yield transporter.sendMail({
                from: `"${project_name}" <${appConfig_1.appConfig.email.from}>`,
                to,
                subject,
                html,
            });
            return info;
        }
        catch (error) {
            logger_1.logger.error("Error sending email", error);
            throw new AppError_1.AppError("Error sending email", http_status_1.default.INTERNAL_SERVER_ERROR);
        }
    });
}
