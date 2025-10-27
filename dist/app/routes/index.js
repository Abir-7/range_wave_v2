"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("./auth.route");
const user_service_route_1 = require("./user_service.route");
const bid_route_1 = require("./bid.route");
const user_route_1 = require("./user.route");
const rating_route_1 = require("./rating.route");
const user_service_progress_route_1 = require("./user_service_progress.route");
const chat_route_1 = require("./chat.route");
const stripe_route_1 = require("./stripe.route");
const router = (0, express_1.Router)();
const apiRoutes = [
    { path: "/auth", route: auth_route_1.AuthRoute },
    { path: "/service", route: user_service_route_1.ServiceRoute },
    { path: "/service", route: user_service_progress_route_1.ServiceProgressRoute },
    { path: "/bid", route: bid_route_1.BidRoute },
    { path: "/user", route: user_route_1.UserRoute },
    { path: "/rating", route: rating_route_1.RatingRoute },
    { path: "/chat", route: chat_route_1.ChatRoute },
    { path: "/stripe", route: stripe_route_1.StripeRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
