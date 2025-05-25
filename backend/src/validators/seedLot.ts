// backend/src/validators/seedLot.ts - Version corrigée

import { z } from "zod";

export const createSeedLotSchema = z.object({
  varietyId: z.number().positive(), // Correction: number au lieu de string
  level: z.enum(["GO", "G1", "G2", "G3", "G4", "R1", "R2"]),
  quantity: z.number().positive("La quantité doit être positive"),
  productionDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Date invalide"),
  multiplierId: z.number().positive().optional(),
  parcelId: z.number().positive().optional(),
  parentLotId: z.string().optional(),
  notes: z.string().optional(),
});

export const updateSeedLotSchema = z.object({
  quantity: z.number().positive().optional(),
  status: z
    .enum([
      "PENDING",
      "CERTIFIED",
      "REJECTED",
      "IN_STOCK",
      "SOLD",
      "ACTIVE",
      "DISTRIBUTED",
    ])
    .optional(),
  notes: z.string().optional(),
  expiryDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Date invalide")
    .optional(),
});

export const seedLotQuerySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((n) => n > 0)
    .optional(),
  pageSize: z
    .string()
    .transform(Number)
    .refine((n) => n > 0 && n <= 100)
    .optional(),
  search: z.string().optional(),
  level: z.enum(["GO", "G1", "G2", "G3", "G4", "R1", "R2"]).optional(),
  status: z
    .enum([
      "PENDING",
      "CERTIFIED",
      "REJECTED",
      "IN_STOCK",
      "SOLD",
      "ACTIVE",
      "DISTRIBUTED",
    ])
    .optional(),
  varietyId: z.string().transform(Number).optional(), // ✅ Accepte string et convertit en number
  multiplierId: z.string().transform(Number).optional(),
  sortBy: z.enum(["productionDate", "quantity", "level", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
