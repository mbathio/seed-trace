// backend/src/routes/production.routes.ts

import { Router } from "express";
import {
  getAllProductions,
  getProductionById,
  createProduction,
  updateProduction,
  deleteProduction,
  harvestProduction,
} from "../controllers/production.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createProductionSchema,
  updateProductionSchema,
  harvestProductionSchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getAllProductions);

router.get("/:id", authenticate, getProductionById);

router.post(
  "/",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  validate(createProductionSchema),
  createProduction
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  validate(updateProductionSchema),
  updateProduction
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  deleteProduction
);

router.post(
  "/:id/harvest",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  validate(harvestProductionSchema),
  harvestProduction
);

export default router;
