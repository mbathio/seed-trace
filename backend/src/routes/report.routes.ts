import { Router } from "express";
import {
  getProductionStats,
  getQualityStats,
  getRegionalStats,
  getLotReport,
  getVarietyReport,
} from "../controllers/report.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Routes accessibles uniquement par les rôles ayant accès aux rapports
const authorizedRoles = [Role.MANAGER, Role.ADMIN, Role.RESEARCHER];

router.get(
  "/production",
  authenticate,
  authorize(...authorizedRoles),
  getProductionStats
);
router.get(
  "/quality",
  authenticate,
  authorize(...authorizedRoles),
  getQualityStats
);
router.get(
  "/regional",
  authenticate,
  authorize(...authorizedRoles),
  getRegionalStats
);
router.get("/lot/:id", authenticate, getLotReport);
router.get("/variety/:id", authenticate, getVarietyReport);

export default router;
