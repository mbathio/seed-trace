// backend/src/services/report.service.ts

import { prisma } from "../config/database";
import { SeedLevel, TestResult, LotStatus, ParcelStatus } from "@prisma/client";
import Logger from "./logging.service";
import DateUtils from "../utils/dateUtils";

/**
 * Service pour la génération de rapports et statistiques
 */
export class ReportService {
  /**
   * Génère des statistiques de production par période et par variété
   * @param startDate Date de début pour les statistiques
   * @param varietyId Filtre optionnel par variété
   * @returns Statistiques de production
   */
  static async getProductionStats(
    startDate: Date,
    varietyId?: number
  ): Promise<any> {
    try {
      const filters: any = {
        productionDate: {
          gte: startDate,
        },
      };

      if (varietyId) {
        filters.varietyId = varietyId;
      }

      // Récupérer les lots pour la période
      const lots = await prisma.seedLot.findMany({
        where: filters,
        include: {
          variety: true,
        },
        orderBy: {
          productionDate: "asc",
        },
      });

      // Grouper par mois et par variété
      const monthlyProduction: Record<string, Record<string, number>> = {};

      lots.forEach((lot) => {
        const date = new Date(lot.productionDate);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!monthlyProduction[key]) {
          monthlyProduction[key] = {};
        }

        const varietyKey = lot.variety.name.toLowerCase().replace(/\s+/g, "_");
        monthlyProduction[key][varietyKey] =
          (monthlyProduction[key][varietyKey] || 0) + lot.quantity;
      });

      // Transformer en tableau pour le frontend
      const result = Object.entries(monthlyProduction).map(
        ([name, varieties]) => ({
          name,
          ...varieties,
        })
      );

      // Ajouter des statistiques supplémentaires
      const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);
      const varietyCounts = lots.reduce((acc: Record<string, number>, lot) => {
        const varietyKey = lot.variety.name.toLowerCase().replace(/\s+/g, "_");
        acc[varietyKey] = (acc[varietyKey] || 0) + lot.quantity;
        return acc;
      }, {});

      return {
        monthly: result,
        total: totalQuantity,
        byVariety: Object.entries(varietyCounts).map(([name, quantity]) => ({
          name,
          quantity,
          percentage: ((quantity as number) / totalQuantity) * 100,
        })),
        timeframe: {
          start: startDate,
          end: new Date(),
        },
      };
    } catch (error) {
      Logger.error(
        `Error generating production stats: ${error.message}`,
        "ReportService",
        { error, startDate, varietyId }
      );
      throw error;
    }
  }

  /**
   * Génère des statistiques de contrôle qualité
   * @returns Statistiques de qualité
   */
  static async getQualityStats(): Promise<any> {
    try {
      // Obtenir tous les contrôles de qualité
      const qualityControls = await prisma.qualityControl.findMany({
        include: {
          lot: {
            include: {
              variety: true,
            },
          },
        },
      });

      // Catégoriser par qualité
      const qualityCategories = [
        { name: "Excellente", min: 95, max: 100, value: 0 },
        { name: "Bonne", min: 85, max: 95, value: 0 },
        { name: "Moyenne", min: 75, max: 85, value: 0 },
        { name: "Insuffisante", min: 0, max: 75, value: 0 },
      ];

      qualityControls.forEach((control) => {
        // Prendre la moyenne entre le taux de germination et la pureté variétale
        const qualityScore =
          (control.germinationRate + control.varietyPurity) / 2;

        for (const category of qualityCategories) {
          if (qualityScore >= category.min && qualityScore < category.max) {
            category.value++;
            break;
          }
        }
      });

      // Calculer également le nombre total par résultat (pass/fail)
      const resultCounts = {
        pass: qualityControls.filter((c) => c.result === TestResult.PASS)
          .length,
        fail: qualityControls.filter((c) => c.result === TestResult.FAIL)
          .length,
      };

      // Calculer les statistiques par niveau de semence
      const statsByLevel: Record<string, any> = {};

      for (const level of Object.values(SeedLevel)) {
        const controlsForLevel = qualityControls.filter(
          (c) => c.lot.level === level
        );

        if (controlsForLevel.length > 0) {
          const avgGermination =
            controlsForLevel.reduce((sum, c) => sum + c.germinationRate, 0) /
            controlsForLevel.length;
          const avgPurity =
            controlsForLevel.reduce((sum, c) => sum + c.varietyPurity, 0) /
            controlsForLevel.length;
          const passRate =
            (controlsForLevel.filter((c) => c.result === TestResult.PASS)
              .length /
              controlsForLevel.length) *
            100;

          statsByLevel[level] = {
            count: controlsForLevel.length,
            avgGermination,
            avgPurity,
            passRate,
          };
        }
      }

      // Calculer les tendances sur les 6 derniers mois
      const sixMonthsAgo = DateUtils.addMonths(new Date(), -6);

      const recentControls = qualityControls.filter(
        (c) => c.controlDate >= sixMonthsAgo
      );

      // Grouper par mois
      const controlsByMonth: Record<string, any[]> = {};

      recentControls.forEach((control) => {
        const date = new Date(control.controlDate);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;

        if (!controlsByMonth[key]) {
          controlsByMonth[key] = [];
        }

        controlsByMonth[key].push(control);
      });

      // Calculer les statistiques mensuelles
      const monthlyStats = Object.entries(controlsByMonth).map(
        ([month, controls]) => {
          const avgGermination =
            controls.reduce((sum, c) => sum + c.germinationRate, 0) /
            controls.length;
          const avgPurity =
            controls.reduce((sum, c) => sum + c.varietyPurity, 0) /
            controls.length;
          const passRate =
            (controls.filter((c) => c.result === TestResult.PASS).length /
              controls.length) *
            100;

          return {
            month,
            avgGermination,
            avgPurity,
            passRate,
            count: controls.length,
          };
        }
      );

      return {
        categories: qualityCategories,
        results: resultCounts,
        byLevel: statsByLevel,
        monthly: monthlyStats,
        total: qualityControls.length,
      };
    } catch (error) {
      Logger.error(
        `Error generating quality stats: ${error.message}`,
        "ReportService",
        { error }
      );
      throw error;
    }
  }

  /**
   * Génère des statistiques par région
   * @returns Statistiques régionales
   */
  static async getRegionalStats(): Promise<any> {
    try {
      // Récupérer toutes les parcelles avec leurs productions
      const parcels = await prisma.parcel.findMany({
        include: {
          productions: {
            include: {
              lot: true,
            },
          },
        },
      });

      // Grouper les parcelles par région (en utilisant les coordonnées comme approximation)
      const regions = [
        {
          name: "Saint-Louis",
          minLat: 16.0,
          maxLat: 16.1,
          minLng: -16.6,
          maxLng: -16.4,
        },
        {
          name: "Dagana",
          minLat: 16.1,
          maxLat: 16.3,
          minLng: -16.5,
          maxLng: -16.3,
        },
        {
          name: "Podor",
          minLat: 16.3,
          maxLat: 16.5,
          minLng: -16.4,
          maxLng: -16.2,
        },
        {
          name: "Richard-Toll",
          minLat: 16.2,
          maxLat: 16.4,
          minLng: -16.6,
          maxLng: -16.4,
        },
        {
          name: "Matam",
          minLat: 16.4,
          maxLat: 16.6,
          minLng: -16.3,
          maxLng: -16.1,
        },
      ];

      // Calculer les statistiques par région
      const regionalStats = regions.map((region) => {
        // Filtrer les parcelles dans cette région
        const regionParcels = parcels.filter(
          (parcel) =>
            parcel.latitude >= region.minLat &&
            parcel.latitude <= region.maxLat &&
            parcel.longitude >= region.minLng &&
            parcel.longitude <= region.maxLng
        );

        // Calculer la surface totale
        const totalArea = regionParcels.reduce(
          (sum, parcel) => sum + parcel.area,
          0
        );

        // Calculer la production totale
        const totalProduction = regionParcels.reduce(
          (sum, parcel) =>
            sum +
            parcel.productions.reduce(
              (prodSum, production) => prodSum + (production.yield || 0),
              0
            ),
          0
        );

        // Calculer le rendement moyen
        const avgYield = totalArea > 0 ? totalProduction / totalArea : 0;

        return {
          region: region.name,
          production: Math.round(totalProduction * 100) / 100, // Arrondir à 2 décimales
          surface: Math.round(totalArea * 100) / 100,
          yield: Math.round(avgYield * 100) / 100,
          parcelCount: regionParcels.length,
        };
      });

      // Ajouter le total
      const total = {
        region: "Total",
        production: regionalStats.reduce(
          (sum, stat) => sum + stat.production,
          0
        ),
        surface: regionalStats.reduce((sum, stat) => sum + stat.surface, 0),
        parcelCount: regionalStats.reduce(
          (sum, stat) => sum + stat.parcelCount,
          0
        ),
        yield:
          regionalStats.reduce((sum, stat) => sum + stat.surface, 0) > 0
            ? regionalStats.reduce((sum, stat) => sum + stat.production, 0) /
              regionalStats.reduce((sum, stat) => sum + stat.surface, 0)
            : 0,
      };

      return {
        regions: regionalStats,
        total,
      };
    } catch (error) {
      Logger.error(
        `Error generating regional stats: ${error.message}`,
        "ReportService",
        { error }
      );
      throw error;
    }
  }

  /**
   * Génère le rapport complet d'un lot de semences
   * @param lotId Identifiant du lot
   * @returns Rapport détaillé du lot
   */
  static async getLotReport(lotId: string): Promise<any> {
    try {
      // Vérifier si le lot existe
      const seedLot = await prisma.seedLot.findUnique({
        where: { id: lotId },
        include: {
          variety: true,
          parentLot: {
            include: {
              variety: true,
            },
          },
          childLots: {
            include: {
              variety: true,
              qualityControls: {
                orderBy: { controlDate: "desc" },
                take: 1,
              },
            },
          },
          qualityControls: {
            orderBy: { controlDate: "desc" },
          },
          productions: {
            include: {
              parcel: true,
            },
          },
          distributedLots: {
            include: {
              multiplier: true,
            },
          },
        },
      });

      if (!seedLot) {
        throw new Error(`Lot de semences non trouvé: ${lotId}`);
      }

      // Générer l'arbre généalogique complet
      const genealogy = await this.getFullGenealogy(lotId);

      // Formater le rapport
      const report = {
        lotInfo: {
          id: seedLot.id,
          variety: seedLot.variety.name,
          level: seedLot.level,
          productionDate: seedLot.productionDate,
          quantity: seedLot.quantity,
          status: seedLot.status,
          qrCode: seedLot.qrCode,
        },
        genealogy: {
          parent: seedLot.parentLot
            ? {
                id: seedLot.parentLot.id,
                variety: seedLot.parentLot.variety.name,
                level: seedLot.parentLot.level,
              }
            : null,
          children: seedLot.childLots.map((child) => ({
            id: child.id,
            variety: child.variety.name,
            level: child.level,
            latestQuality:
              child.qualityControls.length > 0
                ? {
                    germinationRate: child.qualityControls[0].germinationRate,
                    varietyPurity: child.qualityControls[0].varietyPurity,
                    result: child.qualityControls[0].result,
                  }
                : null,
          })),
          fullTree: genealogy,
        },
        qualityControls: seedLot.qualityControls.map((control) => ({
          id: control.id,
          date: control.controlDate,
          germinationRate: control.germinationRate,
          varietyPurity: control.varietyPurity,
          result: control.result,
          observations: control.observations,
        })),
        productions: seedLot.productions.map((production) => ({
          id: production.id,
          parcel: {
            id: production.parcel.id,
            code: production.parcel.code,
            location: `${production.parcel.latitude}, ${production.parcel.longitude}`,
            area: production.parcel.area,
            soilType: production.parcel.soilType,
          },
          sowingDate: production.sowingDate,
          harvestDate: production.harvestDate,
          yield: production.yield,
          status: production.status,
        })),
        distributions: seedLot.distributedLots.map((distribution) => ({
          id: distribution.id,
          multiplier: {
            id: distribution.multiplier.id,
            name: distribution.multiplier.name,
            contact:
              distribution.multiplier.phone || distribution.multiplier.email,
          },
          quantity: distribution.quantity,
          date: distribution.distributionDate,
        })),
        summary: {
          qualityAverage:
            seedLot.qualityControls.length > 0
              ? {
                  germinationRate:
                    seedLot.qualityControls.reduce(
                      (sum, c) => sum + c.germinationRate,
                      0
                    ) / seedLot.qualityControls.length,
                  varietyPurity:
                    seedLot.qualityControls.reduce(
                      (sum, c) => sum + c.varietyPurity,
                      0
                    ) / seedLot.qualityControls.length,
                  passRate:
                    (seedLot.qualityControls.filter(
                      (c) => c.result === TestResult.PASS
                    ).length /
                      seedLot.qualityControls.length) *
                    100,
                }
              : null,
          totalProduction: seedLot.productions.reduce(
            (sum, p) => sum + (p.yield || 0),
            0
          ),
          totalDistributed: seedLot.distributedLots.reduce(
            (sum, d) => sum + d.quantity,
            0
          ),
          remainingQuantity: seedLot.quantity,
        },
      };

      return report;
    } catch (error) {
      Logger.error(
        `Error generating lot report: ${error.message}`,
        "ReportService",
        { error, lotId }
      );
      throw error;
    }
  }

  /**
   * Génère l'arbre généalogique complet d'un lot
   * @param lotId Identifiant du lot
   * @returns Arbre généalogique
   */
  private static async getFullGenealogy(lotId: string): Promise<any> {
    // Fonction récursive pour trouver les ancêtres
    const findAncestors = async (
      currentLotId: string,
      depth: number = 1,
      maxDepth: number = 10
    ): Promise<any> => {
      if (depth > maxDepth) return null; // Limiter la profondeur de récursion

      const lot = await prisma.seedLot.findUnique({
        where: { id: currentLotId },
        include: {
          variety: true,
          parentLot: true,
          qualityControls: {
            orderBy: { controlDate: "desc" },
            take: 1,
          },
        },
      });

      if (!lot || !lot.parentLotId) return null;

      const parent = await findAncestors(lot.parentLotId, depth + 1, maxDepth);

      return {
        id: lot.parentLot.id,
        level: lot.parentLot.level,
        variety: lot.variety.name,
        quality:
          lot.qualityControls.length > 0
            ? {
                germinationRate: lot.qualityControls[0].germinationRate,
                varietyPurity: lot.qualityControls[0].varietyPurity,
                result: lot.qualityControls[0].result,
              }
            : null,
        parent,
      };
    };

    // Fonction récursive pour trouver les descendants
    const findDescendants = async (
      currentLotId: string,
      depth: number = 1,
      maxDepth: number = 10
    ): Promise<any[]> => {
      if (depth > maxDepth) return []; // Limiter la profondeur de récursion

      const children = await prisma.seedLot.findMany({
        where: { parentLotId: currentLotId },
        include: {
          variety: true,
          qualityControls: {
            orderBy: { controlDate: "desc" },
            take: 1,
          },
        },
      });

      if (children.length === 0) return [];

      const result = [];

      for (const child of children) {
        const descendants = await findDescendants(
          child.id,
          depth + 1,
          maxDepth
        );

        result.push({
          id: child.id,
          level: child.level,
          variety: child.variety.name,
          quality:
            child.qualityControls.length > 0
              ? {
                  germinationRate: child.qualityControls[0].germinationRate,
                  varietyPurity: child.qualityControls[0].varietyPurity,
                  result: child.qualityControls[0].result,
                }
              : null,
          children: descendants,
        });
      }

      return result;
    };

    // Obtenir le lot actuel
    const currentLot = await prisma.seedLot.findUnique({
      where: { id: lotId },
      include: {
        variety: true,
        qualityControls: {
          orderBy: { controlDate: "desc" },
          take: 1,
        },
      },
    });

    if (!currentLot) {
      throw new Error(`Lot non trouvé: ${lotId}`);
    }

    // Construire l'arbre généalogique
    const parent = await findAncestors(lotId);
    const children = await findDescendants(lotId);

    return {
      id: currentLot.id,
      level: currentLot.level,
      variety: currentLot.variety.name,
      quality:
        currentLot.qualityControls.length > 0
          ? {
              germinationRate: currentLot.qualityControls[0].germinationRate,
              varietyPurity: currentLot.qualityControls[0].varietyPurity,
              result: currentLot.qualityControls[0].result,
            }
          : null,
      parent,
      children,
    };
  }

  /**
   * Génère un rapport sur une variété de semences
   * @param varietyId Identifiant de la variété
   * @returns Rapport sur la variété
   */
  static async getVarietyReport(varietyId: number): Promise<any> {
    try {
      // Vérifier si la variété existe
      const variety = await prisma.seedVariety.findUnique({
        where: { id: varietyId },
      });

      if (!variety) {
        throw new Error(`Variété non trouvée: ${varietyId}`);
      }

      // Obtenir les lots de cette variété
      const lots = await prisma.seedLot.findMany({
        where: { varietyId },
        include: {
          qualityControls: true,
        },
      });

      // Statistiques par niveau
      const levelStats: Record<string, { count: number; quantity: number }> =
        {};

      // Initialiser les statistiques pour chaque niveau
      Object.values(SeedLevel).forEach((level) => {
        levelStats[level] = { count: 0, quantity: 0 };
      });

      // Remplir les statistiques
      lots.forEach((lot) => {
        levelStats[lot.level].count++;
        levelStats[lot.level].quantity += lot.quantity;
      });

      // Statistiques de qualité
      let totalGermination = 0;
      let totalPurity = 0;
      let controlCount = 0;
      let passCount = 0;

      lots.forEach((lot) => {
        lot.qualityControls.forEach((control) => {
          totalGermination += control.germinationRate;
          totalPurity += control.varietyPurity;
          controlCount++;
          if (control.result === TestResult.PASS) {
            passCount++;
          }
        });
      });

      const qualityStats = {
        averageGermination:
          controlCount > 0 ? totalGermination / controlCount : 0,
        averagePurity: controlCount > 0 ? totalPurity / controlCount : 0,
        passRate: controlCount > 0 ? (passCount / controlCount) * 100 : 0,
        controlCount,
      };

      // Obtenir les productions liées à cette variété
      const productions = await prisma.production.findMany({
        where: {
          lot: {
            varietyId,
          },
        },
        include: {
          parcel: true,
          lot: true,
        },
      });

      // Statistiques de production
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

      // Statistiques par année
      const productionByYear: Record<number, number> = {};

      productions.forEach((prod) => {
        if (prod.yield) {
          const year =
            prod.harvestDate?.getFullYear() || prod.sowingDate.getFullYear();
          productionByYear[year] = (productionByYear[year] || 0) + prod.yield;
        }
      });

      // Trouver les lots actifs récents
      const recentLots = lots
        .filter((lot) => lot.status === LotStatus.ACTIVE)
        .sort((a, b) => b.productionDate.getTime() - a.productionDate.getTime())
        .slice(0, 5);

      // Formater le rapport
      const report = {
        variety: {
          id: variety.id,
          name: variety.name,
          description: variety.description,
          origin: variety.origin,
          creationDate: variety.creationDate,
        },
        stats: {
          lotStats: {
            totalLots: lots.length,
            totalQuantity: lots.reduce((sum, lot) => sum + lot.quantity, 0),
            byLevel: levelStats,
            activeLots: lots.filter((lot) => lot.status === LotStatus.ACTIVE)
              .length,
            distributedLots: lots.filter(
              (lot) => lot.status === LotStatus.DISTRIBUTED
            ).length,
          },
          qualityStats,
          productionStats: {
            totalProductions: productions.length,
            completedProductions: productions.filter((p) => p.harvestDate)
              .length,
            totalArea,
            averageYield,
            productionByYear: Object.entries(productionByYear).map(
              ([year, amount]) => ({
                year: parseInt(year),
                amount,
              })
            ),
          },
        },
        recentActiveLots: recentLots.map((lot) => ({
          id: lot.id,
          level: lot.level,
          quantity: lot.quantity,
          productionDate: lot.productionDate,
        })),
      };

      return report;
    } catch (error) {
      Logger.error(
        `Error generating variety report: ${error.message}`,
        "ReportService",
        { error, varietyId }
      );
      throw error;
    }
  }
}

export default ReportService;
