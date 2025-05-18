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
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getAllMultipliers);
router.get("/:id", authenticate, getMultiplierById);
router.post(
  "/",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  createMultiplier
);
router.put(
  "/:id",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  updateMultiplier
);
router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteMultiplier);
router.get("/:id/lots", authenticate, getMultiplierLots);
router.post(
  "/:id/distribute",
  authenticate,
  authorize(Role.MANAGER, Role.ADMIN),
  distributeLotsToMultiplier
);

export default router;
