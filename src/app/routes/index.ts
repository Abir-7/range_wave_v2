import { Router } from "express";
import { AuthRoute } from "./auth.route";

const router = Router();

const apiRoutes = [{ path: "/auth", route: AuthRoute }];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
