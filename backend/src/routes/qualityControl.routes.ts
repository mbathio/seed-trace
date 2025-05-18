// backend/src/routes/qualityControl.routes.ts

import { Router } from "express";
import {
  getAllQualityControls,
  getQualityControlById,
  createQualityControl,
  updateQualityControl,
  deleteQualityControl,
  getQualityControlsByLotId,
} from "../controllers/qualityControl.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createQualityControlSchema,
  updateQualityControlSchema,
  filterQualityControlSchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(filterQualityControlSchema, { source: "query" }),
  getAllQualityControls
);

router.get("/:id", authenticate, getQualityControlById);

router.get("/lot/:lotId", authenticate, getQualityControlsByLotId);

router.post(
  "/",
  authenticate,
  authorize(Role.TECHNICIAN, Role.INSPECTOR, Role.ADMIN),
  validate(createQualityControlSchema),
  createQualityControl
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.TECHNICIAN, Role.INSPECTOR, Role.ADMIN),
  validate(updateQualityControlSchema),
  updateQualityControl
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  deleteQualityControl
);

export default router;
