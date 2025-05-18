import { Router } from "express";
import {
  getAllParcels,
  getParcelById,
  createParcel,
  updateParcel,
  deleteParcel,
} from "../controllers/parcel.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getAllParcels);
router.get("/:id", authenticate, getParcelById);
router.post(
  "/",
  authenticate,
  authorize(Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  createParcel
);
router.put(
  "/:id",
  authenticate,
  authorize(Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  updateParcel
);
router.delete(
  "/:id",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  deleteParcel
);

export default router;
