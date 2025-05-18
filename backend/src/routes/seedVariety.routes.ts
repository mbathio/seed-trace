// backend/src/routes/seedVariety.routes.ts

import { Router } from "express";
import {
  getAllSeedVarieties,
  getSeedVarietyById,
  createSeedVariety,
  updateSeedVariety,
  deleteSeedVariety,
} from "../controllers/seedVariety.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createSeedVarietySchema,
  updateSeedVarietySchema,
  searchSeedVarietySchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(searchSeedVarietySchema, { source: "query" }),
  getAllSeedVarieties
);

router.get("/:id", authenticate, getSeedVarietyById);

router.post(
  "/",
  authenticate,
  authorize(Role.RESEARCHER, Role.ADMIN),
  validate(createSeedVarietySchema),
  createSeedVariety
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.RESEARCHER, Role.ADMIN),
  validate(updateSeedVarietySchema),
  updateSeedVariety
);

router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteSeedVariety);

export default router;
