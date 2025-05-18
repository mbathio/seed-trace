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
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getAllProductions);
router.get("/:id", authenticate, getProductionById);
router.post(
  "/",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  createProduction
);
router.put(
  "/:id",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
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
  harvestProduction
);

export default router;
