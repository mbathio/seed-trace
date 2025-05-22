// backend/src/routes/qualityControls.ts
import { Router } from "express";
import { QualityControlController } from "../controllers/QualityControlController";
import { validateRequest } from "../middleware/validation";
import { requireRole } from "../middleware/auth";
import {
  createQualityControlSchema,
  updateQualityControlSchema,
} from "../validators/qualityControl";

const router = Router();

// GET /api/quality-controls
router.get("/", QualityControlController.getQualityControls);

// GET /api/quality-controls/:id
router.get("/:id", QualityControlController.getQualityControlById);

// POST /api/quality-controls
router.post(
  "/",
  requireRole("technician", "inspector", "admin"),
  validateRequest({ body: createQualityControlSchema }),
  QualityControlController.createQualityControl
);

// PUT /api/quality-controls/:id
router.put(
  "/:id",
  requireRole("technician", "inspector", "admin"),
  validateRequest({ body: updateQualityControlSchema }),
  QualityControlController.updateQualityControl
);

// DELETE /api/quality-controls/:id
router.delete(
  "/:id",
  requireRole("admin"),
  QualityControlController.deleteQualityControl
);

export default router;
