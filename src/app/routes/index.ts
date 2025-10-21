import { Router } from "express";
import { AuthRoute } from "./auth.route";
import { ServiceRoute } from "./service.route";
import { BidRoute } from "./bid.route";
import { UserRoute } from "./user.route";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: AuthRoute },
  { path: "/service", route: ServiceRoute },
  { path: "/bid", route: BidRoute },
  { path: "/user", route: UserRoute },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
