// backend/src/routes/multipliers.ts - Version corrigée

import { Router } from "express";
import { MultiplierController } from "../controllers/MultiplierController";
import { validateRequest } from "../middleware/validation";
import { requireRole } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const createMultiplierSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  yearsExperience: z.number().min(0),
  certificationLevel: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]), // ✅ Majuscules
  specialization: z.array(z.string()),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const updateMultiplierSchema = createMultiplierSchema.partial();

const contractSchema = z.object({
  varietyId: z.number().positive(), // ✅ Corrigé: number au lieu de string
  startDate: z.string().refine((date: string) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date: string) => !isNaN(Date.parse(date))),
  seedLevel: z.enum(["GO", "G1", "G2", "G3", "G4", "R1", "R2"]),
  expectedQuantity: z.number().positive(),
  parcelId: z.number().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/multipliers
router.get("/", MultiplierController.getMultipliers);

// GET /api/multipliers/:id
router.get("/:id", MultiplierController.getMultiplierById);

// POST /api/multipliers
router.post(
  "/",
  requireRole("MANAGER", "ADMIN"),
  validateRequest({ body: createMultiplierSchema }),
  MultiplierController.createMultiplier
);

// PUT /api/multipliers/:id
router.put(
  "/:id",
  requireRole("MANAGER", "ADMIN"),
  validateRequest({ body: updateMultiplierSchema }),
  MultiplierController.updateMultiplier
);

// DELETE /api/multipliers/:id
router.delete(
  "/:id",
  requireRole("ADMIN"),
  MultiplierController.deleteMultiplier
);

// GET /api/multipliers/:id/contracts
router.get("/:id/contracts", MultiplierController.getContracts);

// POST /api/multipliers/:id/contracts
router.post(
  "/:id/contracts",
  requireRole("MANAGER", "ADMIN"),
  validateRequest({ body: contractSchema }),
  MultiplierController.createContract
);

export default router;
