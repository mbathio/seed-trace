// backend/src/services/qr.service.ts

import QRCode from "qrcode";
import { SeedLevel } from "@prisma/client";

/**
 * Service pour la génération et la gestion des codes QR
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
        errorCorrectionLevel: "H",
        margin: 2,
        width: 300,
      });
      return dataUrl;
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
      throw new Error("Erreur lors de la génération du code QR");
    }
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
      console.error("Erreur lors de la génération du QR code:", error);
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
      console.error("Erreur lors de la génération du QR code:", error);
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
      console.error("Erreur lors de la génération du QR code:", error);
      throw new Error("Erreur lors de la génération du code QR");
    }
  }

  /**
   * Décode un code QR et renvoie les données
   * @param dataUrl Data URL du code QR
   * @returns Données décodées
   */
  static decodeQR(
    dataUrl: string
  ): { type: string; [key: string]: any } | null {
    try {
      // Dans un cas réel, nous utiliserions une bibliothèque de décodage QR,
      // mais pour cette implémentation, nous simulons simplement le décodage
      // en extrayant les données encodées dans le QR code (qui serait normalement
      // stocké dans la base de données)

      // Cette implémentation est simulée et ne fonctionnera pas réellement
      // avec une vraie image QR code. Dans une application réelle, vous devriez
      // utiliser une bibliothèque comme jsQR ou une API de décodage QR.

      // Pour une implémentation réelle, vous pourriez avoir besoin d'un endpoint
      // qui reçoit une image QR et utilise une bibliothèque côté serveur pour la décoder.

      return null;
    } catch (error) {
      console.error("Erreur lors du décodage du QR code:", error);
      return null;
    }
  }
}

export default QRService;
