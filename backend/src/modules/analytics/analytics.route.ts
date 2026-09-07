import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { analyticsController } from "./analytics.controller";

const router = Router();

router.get("/admin", auth(UserRole.ADMIN), analyticsController.getAdminAnalytics);
router.get("/owner", auth(UserRole.OWNER), analyticsController.getOwnerAnalytics);
router.get("/tenant", auth(UserRole.TENANT), analyticsController.getTenantAnalytics);

export const AnalyticsRoutes = router;
