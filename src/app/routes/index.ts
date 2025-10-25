import { Router } from "express";
import { AuthRoute } from "./auth.route";
import { ServiceRoute } from "./user_service.route";
import { BidRoute } from "./bid.route";
import { UserRoute } from "./user.route";
import { RatingRoute } from "./rating.route";
import { ServiceProgressRoute } from "./user_service_progress.route";
import { ChatRoute } from "./chat.route";
import { StripeRoute } from "./stripe.route";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: AuthRoute },
  { path: "/service", route: ServiceRoute },
  { path: "/service", route: ServiceProgressRoute },
  { path: "/bid", route: BidRoute },
  { path: "/user", route: UserRoute },
  { path: "/rating", route: RatingRoute },
  { path: "/chat", route: ChatRoute },
  { path: "/stripe", route: StripeRoute },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
