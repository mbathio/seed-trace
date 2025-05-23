// backend/src/routes/parcels.ts
import { Router } from "express";
import { ParcelController } from "../controllers/ParcelController";
import { validateRequest } from "../middleware/validation";
import { requireRole } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const createParcelSchema = z.object({
  name: z.string().optional(),
  area: z.number().positive(),
  latitude: z.number(),
  longitude: z.number(),
  status: z.enum(["available", "in_use", "resting"]).optional(),
  soilType: z.string().optional(),
  irrigationSystem: z.string().optional(),
  address: z.string().optional(),
  multiplierId: z.number().optional(),
});

const updateParcelSchema = createParcelSchema.partial();

const soilAnalysisSchema = z.object({
  analysisDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  pH: z.number().optional(),
  organicMatter: z.number().optional(),
  nitrogen: z.number().optional(),
  phosphorus: z.number().optional(),
  potassium: z.number().optional(),
  notes: z.string().optional(),
});

// GET /api/parcels
router.get("/", ParcelController.getParcels);

// GET /api/parcels/:id
router.get("/:id", ParcelController.getParcelById);

// POST /api/parcels
router.post(
  "/",
  requireRole("manager", "admin"),
  validateRequest({ body: createParcelSchema }),
  ParcelController.createParcel
);

// PUT /api/parcels/:id
router.put(
  "/:id",
  requireRole("manager", "admin"),
  validateRequest({ body: updateParcelSchema }),
  ParcelController.updateParcel
);

// DELETE /api/parcels/:id
router.delete("/:id", requireRole("admin"), ParcelController.deleteParcel);

// POST /api/parcels/:id/soil-analysis
router.post(
  "/:id/soil-analysis",
  requireRole("technician", "inspector", "admin"),
  validateRequest({ body: soilAnalysisSchema }),
  ParcelController.addSoilAnalysis
);

export default router;
