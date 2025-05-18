// backend/src/controllers/qr.controller.ts

import { Request, Response, NextFunction } from "express";
import QRService from "../services/qr.service";
import { prisma } from "../config/database";
import { NotFoundError, ValidationError } from "../types/errors";
import Logger from "../services/logging.service";
import {
  AuditService,
  AuditAction,
  AuditEntity,
} from "../services/audit.service";
import path from "path";
import fs from "fs";
import { promisify } from "util";

// Convertir les fonctions de callback en promesses
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * Contrôleur pour la gestion des codes QR
 */
export class QRController {
  /**
   * Générer un code QR pour un lot de semences
   * @param req Requête Express
   * @param res Réponse Express
   * @param next Fonction next
   */
  static async generateSeedLotQR(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      // Vérifier si le lot existe
      const seedLot = await prisma.seedLot.findUnique({
        where: { id },
        include: { variety: true },
      });

      if (!seedLot) {
        throw new NotFoundError("Lot de semences non trouvé");
      }

      // Générer le code QR
      const qrCodeUrl = await QRService.generateSeedLotQR(
        seedLot.id,
        seedLot.variety.name,
        seedLot.level,
        seedLot.productionDate
      );

      // Stocker le code QR dans la base de données
      await prisma.seedLot.update({
        where: { id },
        data: { qrCode: qrCodeUrl },
      });

      // Journaliser la génération
      Logger.info(
        `QR Code generated for seed lot ${id}`,
        "QRController",
        {},
        req.user?.id,
        req.ip
      );

      // Enregistrer l'audit
      if (req.user) {
        await AuditService.createAudit({
          userId: req.user.id,
          action: AuditAction.CREATE,
          entity: AuditEntity.SEED_LOT,
          entityId: id,
          details: { action: "generate_qr_code" },
          ipAddress: req.ip,
        });
      }

      return res.json({ qrCode: qrCodeUrl });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Générer un code QR pour un contrôle de qualité
   * @param req Requête Express
   * @param res Réponse Express
   * @param next Fonction next
   */
  static async generateQualityControlQR(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const qualityControlId = parseInt(id);

      // Vérifier si le contrôle de qualité existe
      const qualityControl = await prisma.qualityControl.findUnique({
        where: { id: qualityControlId },
        include: { lot: true },
      });

      if (!qualityControl) {
        throw new NotFoundError("Contrôle de qualité non trouvé");
      }

      // Générer le code QR
      const qrCodeUrl = await QRService.generateQualityControlQR(
        qualityControl.lotId,
        qualityControl.id,
        qualityControl.result,
        qualityControl.controlDate
      );

      return res.json({ qrCode: qrCodeUrl });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Décoder un code QR à partir d'un fichier téléchargé
   * @param req Requête Express
   * @param res Réponse Express
   * @param next Fonction next
   */
  static async decodeQRFromUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new ValidationError("Aucun fichier téléchargé");
      }

      const filePath = req.file.path;

      // Décoder le QR code
      const decodedData = await QRService.decodeQRFromFile(filePath);

      return res.json({
        success: true,
        data: decodedData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Décoder un code QR à partir d'une data URL
   * @param req Requête Express
   * @param res Réponse Express
   * @param next Fonction next
   */
  static async decodeQRFromDataURL(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { dataUrl } = req.body;

      if (!dataUrl) {
        throw new ValidationError("Data URL manquante");
      }

      // Décoder le QR code
      const decodedData = await QRService.decodeQRFromDataURL(dataUrl);

      return res.json({
        success: true,
        data: decodedData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sauvegarder un code QR dans un fichier
   * @param req Requête Express
   * @param res Réponse Express
   * @param next Fonction next
   */
  static async saveQRToFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, type = "seedLot" } = req.params;
      let qrCodeUrl: string;
      let filename: string;

      // Générer le QR code selon le type
      switch (type) {
        case "seedLot":
          // Vérifier si le lot existe
          const seedLot = await prisma.seedLot.findUnique({
            where: { id },
            include: { variety: true },
          });

          if (!seedLot) {
            throw new NotFoundError("Lot de semences non trouvé");
          }

          qrCodeUrl = await QRService.generateSeedLotQR(
            seedLot.id,
            seedLot.variety.name,
            seedLot.level,
            seedLot.productionDate
          );

          filename = `seedlot_${id.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
          break;

        case "qualityControl":
          const qualityControlId = parseInt(id);

          // Vérifier si le contrôle de qualité existe
          const qualityControl = await prisma.qualityControl.findUnique({
            where: { id: qualityControlId },
            include: { lot: true },
          });

          if (!qualityControl) {
            throw new NotFoundError("Contrôle de qualité non trouvé");
          }

          qrCodeUrl = await QRService.generateQualityControlQR(
            qualityControl.lotId,
            qualityControl.id,
            qualityControl.result,
            qualityControl.controlDate
          );

          filename = `quality_control_${id}.png`;
          break;

        default:
          throw new ValidationError("Type non supporté");
      }

      // Créer le répertoire de sortie s'il n'existe pas
      const outputDir = path.join(__dirname, "../../qrcodes");
      await mkdir(outputDir, { recursive: true });

      // Chemin complet du fichier
      const outputPath = path.join(outputDir, filename);

      // Extraire les données de l'image depuis la data URL
      const base64Data = qrCodeUrl.replace(/^data:image\/png;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Écrire l'image dans un fichier
      await writeFile(outputPath, imageBuffer);

      return res.json({
        success: true,
        filename,
        path: outputPath,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Service de vérification d'un code QR
   * @param req Requête Express
   * @param res Réponse Express
   * @param next Fonction next
   */
  static async verifyQR(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.body;

      if (!data) {
        throw new ValidationError("Données QR manquantes");
      }

      let isValid = false;
      let entity = null;

      // Vérifier les données selon le type
      if (data.type === "seedLot" && data.lotId) {
        // Vérifier si le lot existe
        const seedLot = await prisma.seedLot.findUnique({
          where: { id: data.lotId },
          include: { variety: true },
        });

        if (seedLot) {
          isValid = true;
          entity = {
            type: "seedLot",
            id: seedLot.id,
            variety: seedLot.variety.name,
            level: seedLot.level,
            quantity: seedLot.quantity,
            status: seedLot.status,
          };
        }
      } else if (data.type === "qualityControl" && data.controlId) {
        // Vérifier si le contrôle de qualité existe
        const qualityControl = await prisma.qualityControl.findUnique({
          where: { id: data.controlId },
          include: { lot: { include: { variety: true } } },
        });

        if (qualityControl) {
          isValid = true;
          entity = {
            type: "qualityControl",
            id: qualityControl.id,
            lotId: qualityControl.lotId,
            variety: qualityControl.lot.variety.name,
            result: qualityControl.result,
            germinationRate: qualityControl.germinationRate,
            varietyPurity: qualityControl.varietyPurity,
          };
        }
      }

      // Journaliser la vérification
      Logger.info(
        `QR Code verification: ${isValid ? "valid" : "invalid"}`,
        "QRController",
        { data },
        req.user?.id,
        req.ip
      );

      return res.json({
        success: true,
        isValid,
        entity,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default QRController;
