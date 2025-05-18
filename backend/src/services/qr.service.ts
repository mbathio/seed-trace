/**
 * Service pour la gestion des services QR Code
 */

import QRCode from "qrcode";

interface QRCodeOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  color?: {
    dark?: string;
    light?: string;
  };
}

export class QRCodeService {
  /**
   * Génère un code QR sous forme de chaîne Data URL
   * @param data Données à encoder dans le QR code
   * @param options Options de génération du QR code
   * @returns Promise<string> Data URL du QR code
   */
  static async generateDataURL(
    data: string | object,
    options: QRCodeOptions = {}
  ): Promise<string> {
    try {
      const dataString = typeof data === "string" ? data : JSON.stringify(data);

      // Options par défaut
      const defaultOptions: QRCodeOptions = {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "M",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      };

      // Fusionner les options par défaut avec les options fournies
      const mergedOptions = {
        ...defaultOptions,
        ...options,
      };

      return await QRCode.toDataURL(dataString, mergedOptions);
    } catch (error) {
      console.error("QR code generation error:", error);
      throw new Error("Erreur lors de la génération du code QR");
    }
  }

  /**
   * Génère un code QR pour un lot de semences
   * @param lotId Identifiant du lot
   * @param varietyName Nom de la variété
   * @param level Niveau de semence
   * @param productionDate Date de production
   * @returns Promise<string> Data URL du QR code
   */
  static async generateForSeedLot(
    lotId: string,
    varietyName: string,
    level: string,
    productionDate: Date
  ): Promise<string> {
    const lotData = {
      lotId,
      varietyName,
      level,
      productionDate: productionDate.toISOString(),
      generated: new Date().toISOString(),
    };

    return this.generateDataURL(lotData);
  }

  /**
   * Génère un code QR pour un test de qualité
   * @param lotId Identifiant du lot
   * @param controlId Identifiant du contrôle
   * @param result Résultat du test
   * @param date Date du contrôle
   * @returns Promise<string> Data URL du QR code
   */
  static async generateForQualityControl(
    lotId: string,
    controlId: number,
    result: string,
    date: Date
  ): Promise<string> {
    const controlData = {
      lotId,
      controlId,
      result,
      controlDate: date.toISOString(),
      generated: new Date().toISOString(),
    };

    return this.generateDataURL(controlData);
  }

  /**
   * Génère un code QR pour une distribution de lot
   * @param lotId Identifiant du lot
   * @param multiplierId Identifiant du multiplicateur
   * @param quantity Quantité distribuée
   * @param date Date de distribution
   * @returns Promise<string> Data URL du QR code
   */
  static async generateForDistribution(
    lotId: string,
    multiplierId: number,
    quantity: number,
    date: Date
  ): Promise<string> {
    const distributionData = {
      lotId,
      multiplierId,
      quantity,
      distributionDate: date.toISOString(),
      generated: new Date().toISOString(),
    };

    return this.generateDataURL(distributionData);
  }
}

export default QRCodeService;
