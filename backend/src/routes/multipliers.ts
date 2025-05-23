// backend/src/routes/multipliers.ts
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
  certificationLevel: z.enum(["beginner", "intermediate", "expert"]),
  specialization: z.array(z.string()),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const updateMultiplierSchema = createMultiplierSchema.partial();

const contractSchema = z.object({
  varietyId: z.string().min(1),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
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
  requireRole("manager", "admin"),
  validateRequest({ body: createMultiplierSchema }),
  MultiplierController.createMultiplier
);

// PUT /api/multipliers/:id
router.put(
  "/:id",
  requireRole("manager", "admin"),
  validateRequest({ body: updateMultiplierSchema }),
  MultiplierController.updateMultiplier
);

// DELETE /api/multipliers/:id
router.delete(
  "/:id",
  requireRole("admin"),
  MultiplierController.deleteMultiplier
);

// GET /api/multipliers/:id/contracts
router.get("/:id/contracts", MultiplierController.getContracts);

// POST /api/multipliers/:id/contracts
router.post(
  "/:id/contracts",
  requireRole("manager", "admin"),
  validateRequest({ body: contractSchema }),
  MultiplierController.createContract
);

export default router;
