"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler/globalErrorHandler");
const notFound_1 = require("./app/middleware/notFound");
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./app/routes"));
const stripe_controller_1 = require("./app/controller/stripe.controller");
const app = (0, express_1.default)();
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
const cors_option = {
    origin: [
        "http://localhost:3000",
        "https://stripe-front-end-for-test.vercel.app",
        "https://stripe-front-end.vercel.app",
        "https://stripe-front-104v2do4v-abir7s-projects.vercel.app",
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
};
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(cors_option));
app.use(limiter);
app.use("/api/stripe/webhook", express_1.default.raw({ type: "application/json" }), stripe_controller_1.StripeController.stripeWebhook);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    res.send("Server is ok.");
});
app.use(express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// Error handler
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
