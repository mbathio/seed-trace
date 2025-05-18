// backend/src/routes/seedLot.routes.ts

import { Router } from "express";
import {
  getAllSeedLots,
  getSeedLotById,
  createSeedLot,
  updateSeedLot,
  deleteSeedLot,
  getSeedLotGenealogy,
  generateQRCode,
} from "../controllers/seedLot.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createSeedLotSchema,
  updateSeedLotSchema,
  searchSeedLotSchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(searchSeedLotSchema, { source: "query" }),
  getAllSeedLots
);

router.get("/:id", authenticate, getSeedLotById);

router.post(
  "/",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.ADMIN),
  validate(createSeedLotSchema),
  createSeedLot
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.ADMIN),
  validate(updateSeedLotSchema),
  updateSeedLot
);

router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteSeedLot);

router.get("/:id/genealogy", authenticate, getSeedLotGenealogy);

router.get("/:id/qrcode", authenticate, generateQRCode);

export default router;
