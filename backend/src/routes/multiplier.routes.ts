// backend/src/routes/multiplier.routes.ts

import { Router } from "express";
import {
  getAllMultipliers,
  getMultiplierById,
  createMultiplier,
  updateMultiplier,
  deleteMultiplier,
  getMultiplierLots,
  distributeLotsToMultiplier,
} from "../controllers/multiplier.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createMultiplierSchema,
  updateMultiplierSchema,
  distributeLotSchema,
  filterMultiplierSchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(filterMultiplierSchema, { source: "query" }),
  getAllMultipliers
);

router.get("/:id", authenticate, getMultiplierById);

router.post(
  "/",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  validate(createMultiplierSchema),
  createMultiplier
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  validate(updateMultiplierSchema),
  updateMultiplier
);

router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteMultiplier);

router.get("/:id/lots", authenticate, getMultiplierLots);

router.post(
  "/:id/distribute",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  validate(distributeLotSchema),
  distributeLotsToMultiplier
);

export default router;
