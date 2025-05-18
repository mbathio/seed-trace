import { Router } from "express";
import {
  getAllSeedVarieties,
  getSeedVarietyById,
  createSeedVariety,
  updateSeedVariety,
  deleteSeedVariety,
} from "../controllers/seedVariety.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getAllSeedVarieties);
router.get("/:id", authenticate, getSeedVarietyById);
router.post(
  "/",
  authenticate,
  authorize(Role.RESEARCHER, Role.ADMIN),
  createSeedVariety
);
router.put(
  "/:id",
  authenticate,
  authorize(Role.RESEARCHER, Role.ADMIN),
  updateSeedVariety
);
router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteSeedVariety);

export default router;
