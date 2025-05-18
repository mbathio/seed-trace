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
import { Role } from "@prisma/client";

const router = Router();

router.get("/", authenticate, getAllQualityControls);
router.get("/:id", authenticate, getQualityControlById);
router.get("/lot/:lotId", authenticate, getQualityControlsByLotId);
router.post(
  "/",
  authenticate,
  authorize(Role.TECHNICIAN, Role.INSPECTOR, Role.ADMIN),
  createQualityControl
);
router.put(
  "/:id",
  authenticate,
  authorize(Role.TECHNICIAN, Role.INSPECTOR, Role.ADMIN),
  updateQualityControl
);
router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  deleteQualityControl
);

export default router;
