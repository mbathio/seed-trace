// backend/src/utils/idGenerator.ts

import { SeedLevel } from "@prisma/client";
import { prisma } from "../config/database";

/**
 * Utilitaire pour générer des identifiants uniques
 */
export class IdGenerator {
  /**
   * Génère un identifiant unique pour un lot de semences
   * Format: XX-NIVEAU-ANNÉE-SEQ
   * Exemple: SA-GO-2023-001
   *
   * @param level Niveau de semence (GO, G1, G2, etc.)
   * @param varietyId Identifiant de la variété
   * @returns Identifiant unique pour le lot
   */
  static async generateSeedLotId(
    level: SeedLevel,
    varietyId: number
  ): Promise<string> {
    const currentYear = new Date().getFullYear();

    // Récupérer la variété
    const variety = await prisma.seedVariety.findUnique({
      where: { id: varietyId },
    });

    if (!variety) {
      throw new Error(`Variété non trouvée avec l'ID: ${varietyId}`);
    }

    // Extraire les 2 premières lettres du nom de la variété et les mettre en majuscule
    const prefix = variety.name.substring(0, 2).toUpperCase();

    // Compter le nombre de lots existants pour cette variété et ce niveau cette année
    const existingLots = await prisma.seedLot.count({
      where: {
        level,
        varietyId,
        id: {
          startsWith: `${prefix}-${level}-${currentYear}`,
        },
      },
    });

    // Générer le numéro séquentiel
    const sequentialNumber = (existingLots + 1).toString().padStart(3, "0");

    // Générer l'identifiant
    return `${prefix}-${level}-${currentYear}-${sequentialNumber}`;
  }

  /**
   * Génère un code unique pour une parcelle
   * @returns Code unique pour une parcelle (ex: P001)
   */
  static async generateParcelCode(): Promise<string> {
    const prefix = "P";

    // Trouver le dernier code utilisé
    const lastParcel = await prisma.parcel.findFirst({
      where: {
        code: {
          startsWith: prefix,
        },
      },
      orderBy: {
        code: "desc",
      },
    });

    let counter = 1;

    if (lastParcel && lastParcel.code) {
      // Extraire le numéro du dernier code
      const lastNumber = parseInt(lastParcel.code.replace(prefix, ""));
      if (!isNaN(lastNumber)) {
        counter = lastNumber + 1;
      }
    }

    // Générer le nouveau code
    return `${prefix}${counter.toString().padStart(3, "0")}`;
  }

  /**
   * Génère un identifiant unique pour une distribution de lot
   * @param lotId Identifiant du lot
   * @param multiplierId Identifiant du multiplicateur
   * @returns Identifiant unique pour la distribution (ex: DIS-SL-GO-2023-001-M001-20230315)
   */
  static generateDistributionId(lotId: string, multiplierId: number): string {
    const date = new Date();
    const dateString = date.toISOString().split("T")[0].replace(/-/g, "");
    return `DIS-${lotId}-M${multiplierId
      .toString()
      .padStart(3, "0")}-${dateString}`;
  }
}

export default IdGenerator;
