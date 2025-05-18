/**
 * Service pour la gestion des variétés de semences
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SeedVarietyService {
  /**
   * Vérifie si une variété avec le même nom existe déjà
   * @param name Nom de la variété
   * @param excludeId ID à exclure (pour les mises à jour)
   * @returns boolean
   */
  static async nameExists(name: string, excludeId?: number): Promise<boolean> {
    const filter: any = {
      name: {
        equals: name,
        mode: "insensitive", // Ignore la casse
      },
    };

    if (excludeId) {
      filter.id = { not: excludeId };
    }

    const count = await prisma.seedVariety.count({
      where: filter,
    });

    return count > 0;
  }

  /**
   * Recherche des variétés par nom ou description
   * @param searchTerm Terme de recherche
   * @param limit Nombre maximum de résultats
   * @returns Liste des variétés correspondantes
   */
  static async search(searchTerm: string, limit: number = 10): Promise<any[]> {
    return prisma.seedVariety.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { origin: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { name: "asc" },
    });
  }

  /**
   * Obtient les statistiques d'une variété
   * @param varietyId ID de la variété
   * @returns Statistiques sur la variété
   */
  static async getStatistics(varietyId: number): Promise<any> {
    // Vérifier si la variété existe
    const variety = await prisma.seedVariety.findUnique({
      where: { id: varietyId },
    });

    if (!variety) {
      throw new Error(`Variété non trouvée avec l'ID: ${varietyId}`);
    }

    // Récupérer les lots de cette variété
    const lots = await prisma.seedLot.findMany({
      where: { varietyId },
      include: {
        qualityControls: true,
      },
    });

    // Calculer les statistiques par niveau
    const statsByLevel: any = {
      GO: { count: 0, quantity: 0 },
      G1: { count: 0, quantity: 0 },
      G2: { count: 0, quantity: 0 },
      G3: { count: 0, quantity: 0 },
      R1: { count: 0, quantity: 0 },
      R2: { count: 0, quantity: 0 },
    };

    for (const lot of lots) {
      statsByLevel[lot.level].count++;
      statsByLevel[lot.level].quantity += lot.quantity;
    }

    // Calculer les statistiques de qualité
    let totalGermination = 0;
    let totalPurity = 0;
    let controlCount = 0;
    let passCount = 0;

    for (const lot of lots) {
      for (const control of lot.qualityControls) {
        totalGermination += control.germinationRate;
        totalPurity += control.varietyPurity;
        controlCount++;
        if (control.result === "PASS") {
          passCount++;
        }
      }
    }

    const qualityStats = {
      averageGermination:
        controlCount > 0 ? totalGermination / controlCount : 0,
      averagePurity: controlCount > 0 ? totalPurity / controlCount : 0,
      passRate: controlCount > 0 ? (passCount / controlCount) * 100 : 0,
      controlCount,
    };

    // Récupérer les productions liées à cette variété
    const productions = await prisma.production.findMany({
      where: {
        lot: {
          varietyId,
        },
      },
      include: {
        parcel: true,
      },
    });

    // Calculer la surface totale utilisée pour cette variété
    const totalArea = productions.reduce(
      (sum, prod) => sum + prod.parcel.area,
      0
    );

    // Calculer le rendement moyen
    let totalYield = 0;
    let harvestedCount = 0;

    for (const production of productions) {
      if (production.yield) {
        totalYield += production.yield;
        harvestedCount++;
      }
    }

    const averageYield = harvestedCount > 0 ? totalYield / harvestedCount : 0;

    return {
      variety: {
        id: variety.id,
        name: variety.name,
        description: variety.description,
        origin: variety.origin,
        creationDate: variety.creationDate,
      },
      stats: {
        totalLots: lots.length,
        totalQuantity: lots.reduce((sum, lot) => sum + lot.quantity, 0),
        byLevel: statsByLevel,
        quality: qualityStats,
        production: {
          totalProductions: productions.length,
          totalArea,
          averageYield,
        },
      },
    };
  }

  /**
   * Vérifie si une variété peut être supprimée (aucun lot associé)
   * @param varietyId ID de la variété
   * @returns {boolean} true si la variété peut être supprimée
   */
  static async canDelete(varietyId: number): Promise<{
    canDelete: boolean;
    reason?: string;
    associatedLots?: any[];
  }> {
    // Vérifier si la variété existe
    const variety = await prisma.seedVariety.findUnique({
      where: { id: varietyId },
    });

    if (!variety) {
      return { canDelete: false, reason: "Variété non trouvée" };
    }

    // Vérifier s'il existe des lots associés
    const associatedLots = await prisma.seedLot.findMany({
      where: { varietyId },
      select: { id: true, level: true, quantity: true, status: true },
    });

    if (associatedLots.length > 0) {
      return {
        canDelete: false,
        reason: "Cette variété possède des lots de semences associés",
        associatedLots,
      };
    }

    return { canDelete: true };
  }

  /**
   * Obtient les variétés les plus utilisées (en termes de quantité produite)
   * @param limit Nombre maximum de variétés à retourner
   * @returns Liste des variétés les plus utilisées
   */
  static async getMostUsed(limit: number = 5): Promise<any[]> {
    const varieties = await prisma.seedVariety.findMany({
      include: {
        lots: true,
      },
    });

    // Calculer la quantité totale par variété
    const varietiesWithQuantity = varieties.map((variety) => {
      const totalQuantity = variety.lots.reduce(
        (sum, lot) => sum + lot.quantity,
        0
      );
      return {
        id: variety.id,
        name: variety.name,
        description: variety.description,
        origin: variety.origin,
        creationDate: variety.creationDate,
        totalQuantity,
        lotCount: variety.lots.length,
      };
    });

    // Trier par quantité totale décroissante
    return varietiesWithQuantity
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }
}

export default SeedVarietyService;
