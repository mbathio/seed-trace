// backend/src/routes/report.routes.ts

import { Router } from "express";
import {
  getProductionStats,
  getQualityStats,
  getRegionalStats,
  getLotReport,
  getVarietyReport,
} from "../controllers/report.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  productionStatsSchema,
  qualityStatsSchema,
  regionalStatsSchema,
  lotReportSchema,
  varietyReportSchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

// Routes accessibles uniquement par les rôles ayant accès aux rapports
const authorizedRoles = [Role.MANAGER, Role.ADMIN, Role.RESEARCHER];

router.get(
  "/production",
  authenticate,
  authorize(...authorizedRoles),
  validate(productionStatsSchema, { source: "query" }),
  getProductionStats
);

router.get(
  "/quality",
  authenticate,
  authorize(...authorizedRoles),
  validate(qualityStatsSchema, { source: "query" }),
  getQualityStats
);

router.get(
  "/regional",
  authenticate,
  authorize(...authorizedRoles),
  validate(regionalStatsSchema, { source: "query" }),
  getRegionalStats
);

router.get(
  "/lot/:id",
  authenticate,
  validate(lotReportSchema, { source: "params" }),
  getLotReport
);

router.get(
  "/variety/:id",
  authenticate,
  validate(varietyReportSchema, { source: "params" }),
  getVarietyReport
);

export default router;
