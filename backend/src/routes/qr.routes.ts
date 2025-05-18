// backend/src/routes/qr.routes.ts (Mise à jour avec validations)

import { Router } from "express";
import QRController from "../controllers/qr.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { uploadQRImage } from "../middleware/upload.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  decodeQRDataURLSchema,
  verifyQRSchema,
  saveQRSchema,
  generateQRSchema,
} from "../validation";
import { Role } from "@prisma/client";

const router = Router();

// Routes pour la génération de codes QR
router.get(
  "/seed-lot/:id",
  authenticate,
  validate(generateQRSchema, { source: "params" }),
  QRController.generateSeedLotQR
);

router.get(
  "/quality-control/:id",
  authenticate,
  validate(generateQRSchema, { source: "params" }),
  QRController.generateQualityControlQR
);

// Routes pour le décodage de codes QR
router.post(
  "/decode/upload",
  authenticate,
  uploadQRImage,
  QRController.decodeQRFromUpload
);

router.post(
  "/decode/data-url",
  authenticate,
  validate(decodeQRDataURLSchema),
  QRController.decodeQRFromDataURL
);

// Route pour vérifier un code QR
router.post(
  "/verify",
  authenticate,
  validate(verifyQRSchema),
  QRController.verifyQR
);

// Route pour sauvegarder un code QR dans un fichier
router.get(
  "/save/:type/:id",
  authenticate,
  authorize(Role.RESEARCHER, Role.TECHNICIAN, Role.MANAGER, Role.ADMIN),
  validate(saveQRSchema, { source: "params" }),
  QRController.saveQRToFile
);

export default router;
