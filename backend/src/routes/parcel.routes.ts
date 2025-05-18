// backend/src/routes/parcel.routes.ts

import { Router } from "express";
import {
  getAllParcels,
  getParcelById,
  createParcel,
  updateParcel,
  deleteParcel,
} from "../controllers/parcel.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createParcelSchema,
  updateParcelSchema,
  filterParcelSchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(filterParcelSchema, { source: "query" }),
  getAllParcels
);

router.get("/:id", authenticate, getParcelById);

router.post(
  "/",
  authenticate,
  authorize(Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  validate(createParcelSchema),
  createParcel
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  validate(updateParcelSchema),
  updateParcel
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  deleteParcel
);

export default router;
