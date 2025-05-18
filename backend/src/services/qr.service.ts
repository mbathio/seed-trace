// backend/src/services/qr.service.ts

import QRCode from "qrcode";
import jsQR from "jsqr"; // Bibliothèque pour décoder les QR codes
import { createCanvas, loadImage } from "canvas"; // Pour créer un canvas et charger les images
import { SeedLevel } from "@prisma/client";
import Logger from "./logging.service";
import fs from "fs";
import { promisify } from "util";

// Convertir les fonctions de callback en promesses
const readFile = promisify(fs.readFile);

/**
 * Service pour la génération et la lecture des codes QR
 */
export class QRService {
  /**
   * Génère un code QR pour un lot de semences
   * @param lotId Identifiant du lot
   * @param varietyName Nom de la variété
   * @param level Niveau de semence
   * @param productionDate Date de production
   * @returns Data URL du code QR généré
   */
  static async generateSeedLotQR(
    lotId: string,
    varietyName: string,
    level: SeedLevel,
    productionDate: Date
  ): Promise<string> {
    // Création des données à encoder dans le QR code
    const qrData = {
      type: "seedLot",
      lotId,
      varietyName,
      level,
      productionDate: productionDate.toISOString(),
      generated: new Date().toISOString(),
    };

    // Générer le code QR
    try {
      const dataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: "H", // Niveau de correction d'erreur élevé pour une meilleure lecture
        margin: 2,
        width: 300,
        color: {
          dark: "#000000", // Couleur des modules
          light: "#FFFFFF", // Couleur de fond
        },
      });
      return dataUrl;
    } catch (error) {
      Logger.error("Erreur lors de la génération du QR code:", "QRService", {
        error,
        lotId,
      });
      throw new Error("Erreur lors de la génération du code QR");
    }
  }

  /**
   * Méthode pour la compatibilité avec seedlot.service.ts
   * Génère un code QR pour un lot de semences
   */
  static async generateForSeedLot(
    lotId: string,
    varietyName: string,
    level: SeedLevel,
    productionDate: Date
  ): Promise<string> {
    return this.generateSeedLotQR(lotId, varietyName, level, productionDate);
  }

  /**
   * Génère un code QR pour un contrôle de qualité
   * @param lotId Identifiant du lot
   * @param controlId Identifiant du contrôle
   * @param result Résultat du contrôle
   * @param controlDate Date du contrôle
   * @returns Data URL du code QR généré
   */
  static async generateQualityControlQR(
    lotId: string,
    controlId: number,
    result: string,
    controlDate: Date
  ): Promise<string> {
    // Création des données à encoder dans le QR code
    const qrData = {
      type: "qualityControl",
      lotId,
      controlId,
      result,
      controlDate: controlDate.toISOString(),
      generated: new Date().toISOString(),
    };

    // Générer le code QR
    try {
      const dataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 300,
      });
      return dataUrl;
    } catch (error) {
      Logger.error("Erreur lors de la génération du QR code:", "QRService", {
        error,
        lotId,
        controlId,
      });
      throw new Error("Erreur lors de la génération du code QR");
    }
  }

  /**
   * Génère un code QR pour une parcelle
   * @param parcelId Identifiant de la parcelle
   * @param location Coordonnées GPS
   * @param area Surface en hectares
   * @returns Data URL du code QR généré
   */
  static async generateParcelQR(
    parcelId: number,
    location: { latitude: number; longitude: number },
    area: number
  ): Promise<string> {
    // Création des données à encoder dans le QR code
    const qrData = {
      type: "parcel",
      parcelId,
      location,
      area,
      generated: new Date().toISOString(),
    };

    // Générer le code QR
    try {
      const dataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 300,
      });
      return dataUrl;
    } catch (error) {
      Logger.error("Erreur lors de la génération du QR code:", "QRService", {
        error,
        parcelId,
      });
      throw new Error("Erreur lors de la génération du code QR");
    }
  }

  /**
   * Génère un code QR pour une distribution de semences
   * @param distributionId Identifiant de la distribution
   * @param lotId Identifiant du lot
   * @param multiplierId Identifiant du multiplicateur
   * @param quantity Quantité distribuée
   * @param date Date de distribution
   * @returns Data URL du code QR généré
   */
  static async generateDistributionQR(
    distributionId: number,
    lotId: string,
    multiplierId: number,
    quantity: number,
    date: Date
  ): Promise<string> {
    // Création des données à encoder dans le QR code
    const qrData = {
      type: "distribution",
      distributionId,
      lotId,
      multiplierId,
      quantity,
      date: date.toISOString(),
      generated: new Date().toISOString(),
    };

    // Générer le code QR
    try {
      const dataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 300,
      });
      return dataUrl;
    } catch (error) {
      Logger.error("Erreur lors de la génération du QR code:", "QRService", {
        error,
        distributionId,
        lotId,
      });
      throw new Error("Erreur lors de la génération du code QR");
    }
  }

  /**
   * Décode une image QR code à partir d'une data URL
   * @param dataUrl Data URL de l'image QR code
   * @returns Données décodées du QR code
   */
  static async decodeQRFromDataURL(dataUrl: string): Promise<any> {
    try {
      // Charger l'image depuis la data URL
      const image = await loadImage(dataUrl);

      // Créer un canvas pour traiter l'image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      // Dessiner l'image sur le canvas
      ctx.drawImage(image, 0, 0);

      // Obtenir les données de l'image
      const imageData = ctx.getImageData(0, 0, image.width, image.height);

      // Décoder le QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (!code) {
        throw new Error("Aucun QR code trouvé dans l'image");
      }

      // Analyser les données JSON
      return JSON.parse(code.data);
    } catch (error) {
      Logger.error("Erreur lors du décodage du QR code:", "QRService", {
        error,
      });
      throw new Error(`Erreur lors du décodage du QR code: ${error.message}`);
    }
  }

  /**
   * Décode une image QR code à partir d'un fichier
   * @param filePath Chemin du fichier image
   * @returns Données décodées du QR code
   */
  static async decodeQRFromFile(filePath: string): Promise<any> {
    try {
      // Lire le fichier
      const fileData = await readFile(filePath);

      // Charger l'image
      const image = await loadImage(fileData);

      // Créer un canvas pour traiter l'image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      // Dessiner l'image sur le canvas
      ctx.drawImage(image, 0, 0);

      // Obtenir les données de l'image
      const imageData = ctx.getImageData(0, 0, image.width, image.height);

      // Décoder le QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (!code) {
        throw new Error("Aucun QR code trouvé dans l'image");
      }

      // Analyser les données JSON
      return JSON.parse(code.data);
    } catch (error) {
      Logger.error(
        "Erreur lors du décodage du QR code depuis le fichier:",
        "QRService",
        { error, filePath }
      );
      throw new Error(
        `Erreur lors du décodage du QR code depuis le fichier: ${error.message}`
      );
    }
  }

  /**
   * Décode une image QR code à partir d'un buffer
   * @param imageBuffer Buffer contenant l'image
   * @returns Données décodées du QR code
   */
  static async decodeQRFromBuffer(imageBuffer: Buffer): Promise<any> {
    try {
      // Charger l'image depuis le buffer
      const image = await loadImage(imageBuffer);

      // Créer un canvas pour traiter l'image
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      // Dessiner l'image sur le canvas
      ctx.drawImage(image, 0, 0);

      // Obtenir les données de l'image
      const imageData = ctx.getImageData(0, 0, image.width, image.height);

      // Décoder le QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (!code) {
        throw new Error("Aucun QR code trouvé dans l'image");
      }

      // Analyser les données JSON
      return JSON.parse(code.data);
    } catch (error) {
      Logger.error(
        "Erreur lors du décodage du QR code depuis le buffer:",
        "QRService",
        { error }
      );
      throw new Error(
        `Erreur lors du décodage du QR code depuis le buffer: ${error.message}`
      );
    }
  }

  /**
   * Génère et enregistre un code QR dans un fichier
   * @param data Données à encoder
   * @param outputPath Chemin de sortie du fichier
   * @returns Chemin du fichier généré
   */
  static async saveQRCodeToFile(
    data: any,
    outputPath: string
  ): Promise<string> {
    try {
      await QRCode.toFile(outputPath, JSON.stringify(data), {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 300,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return outputPath;
    } catch (error) {
      Logger.error(
        "Erreur lors de l'enregistrement du QR code dans un fichier:",
        "QRService",
        { error, outputPath }
      );
      throw new Error(
        `Erreur lors de l'enregistrement du QR code: ${error.message}`
      );
    }
  }
}

export default QRService;
