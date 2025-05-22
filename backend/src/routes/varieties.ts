// backend/src/routes/varieties.ts
import { Router } from "express";
import { VarietyController } from "../controllers/VarietyController";
import { validateRequest } from "../middleware/validation";
import { requireRole } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const createVarietySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  cropType: z.enum(["rice", "maize", "peanut", "sorghum", "cowpea", "millet"]),
  description: z.string().optional(),
  maturityDays: z.number().positive(),
  yieldPotential: z.number().positive().optional(),
  resistances: z.array(z.string()).optional(),
  origin: z.string().optional(),
  releaseYear: z.number().optional(),
});

const updateVarietySchema = createVarietySchema.partial().omit({ id: true });

// GET /api/varieties
router.get("/", VarietyController.getVarieties);

// GET /api/varieties/:id
router.get("/:id", VarietyController.getVarietyById);

// POST /api/varieties
router.post(
  "/",
  requireRole("researcher", "admin"),
  validateRequest({ body: createVarietySchema }),
  VarietyController.createVariety
);

// PUT /api/varieties/:id
router.put(
  "/:id",
  requireRole("researcher", "admin"),
  validateRequest({ body: updateVarietySchema }),
  VarietyController.updateVariety
);

// DELETE /api/varieties/:id
router.delete("/:id", requireRole("admin"), VarietyController.deleteVariety);

export default router;
