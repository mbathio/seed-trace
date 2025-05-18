import { Request, Response } from "express";
import { prisma } from "../app";
import { SeedLevel, TestResult } from "@prisma/client";

// Obtenir les statistiques de production
export const getProductionStats = async (req: Request, res: Response) => {
  try {
    const { period = "6months", varietyId } = req.query;

    // Déterminer la date de début en fonction de la période
    const startDate = new Date();
    if (period === "3months") {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (period === "6months") {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === "1year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const filters: any = {
      productionDate: {
        gte: startDate,
      },
    };

    if (varietyId) {
      filters.varietyId = parseInt(varietyId as string);
    }

    // Obtenir les lots pour la période
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

      const varietyName = lot.variety.name.toLowerCase().replace(/\s+/g, "_");

      monthlyProduction[key][varietyName] =
        (monthlyProduction[key][varietyName] || 0) + lot.quantity;
    });

    // Transformer en tableau pour le frontend
    const result = Object.entries(monthlyProduction).map(
      ([name, varieties]) => ({
        name,
        ...varieties,
      })
    );

    return res.json(result);
  } catch (error) {
    console.error("Get production stats error:", error);
    return res
      .status(500)
      .json({
        message:
          "Erreur lors de la récupération des statistiques de production",
      });
  }
};

// Obtenir les statistiques de qualité
export const getQualityStats = async (req: Request, res: Response) => {
  try {
    // Obtenir tous les contrôles de qualité
    const qualityControls = await prisma.qualityControl.findMany();

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
      pass: qualityControls.filter((c) => c.result === TestResult.PASS).length,
      fail: qualityControls.filter((c) => c.result === TestResult.FAIL).length,
    };

    return res.json({
      categories: qualityCategories,
      results: resultCounts,
      total: qualityControls.length,
    });
  } catch (error) {
    console.error("Get quality stats error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des statistiques de qualité",
      });
  }
};

// Obtenir les statistiques régionales
export const getRegionalStats = async (req: Request, res: Response) => {
  try {
    // Cette fonction nécessiterait des données géographiques plus détaillées
    // Pour l'exemple, nous allons simuler les données régionales

    const regions = [
      { region: "Saint-Louis", production: 450, surface: 120 },
      { region: "Dagana", production: 380, surface: 100 },
      { region: "Podor", production: 320, surface: 85 },
      { region: "Richard-Toll", production: 290, surface: 75 },
      { region: "Matam", production: 250, surface: 65 },
    ];

    return res.json(regions);
  } catch (error) {
    console.error("Get regional stats error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des statistiques régionales",
      });
  }
};

// Obtenir le rapport détaillé d'un lot
export const getLotReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le lot existe
    const seedLot = await prisma.seedLot.findUnique({
      where: { id },
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
      return res.status(404).json({ message: "Lot de semences non trouvé" });
    }

    // Formater le rapport
    const report = {
      lotInfo: {
        id: seedLot.id,
        variety: seedLot.variety.name,
        level: seedLot.level,
        productionDate: seedLot.productionDate,
        quantity: seedLot.quantity,
        status: seedLot.status,
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
        })),
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
          location: `${production.parcel.latitude}, ${production.parcel.longitude}`,
          area: production.parcel.area,
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
        },
        quantity: distribution.quantity,
        date: distribution.distributionDate,
      })),
    };

    return res.json(report);
  } catch (error) {
    console.error("Get lot report error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du rapport du lot" });
  }
};

// Obtenir le rapport d'une variété
export const getVarietyReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si la variété existe
    const variety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(id) },
    });

    if (!variety) {
      return res.status(404).json({ message: "Variété non trouvée" });
    }

    // Obtenir les lots de cette variété
    const lots = await prisma.seedLot.findMany({
      where: { varietyId: parseInt(id) },
      include: {
        qualityControls: true,
      },
    });

    // Statistiques par niveau
    const levelStats: Record<SeedLevel, { count: number; quantity: number }> = {
      [SeedLevel.GO]: { count: 0, quantity: 0 },
      [SeedLevel.G1]: { count: 0, quantity: 0 },
      [SeedLevel.G2]: { count: 0, quantity: 0 },
      [SeedLevel.G3]: { count: 0, quantity: 0 },
      [SeedLevel.R1]: { count: 0, quantity: 0 },
      [SeedLevel.R2]: { count: 0, quantity: 0 },
    };

    lots.forEach((lot) => {
      levelStats[lot.level].count++;
      levelStats[lot.level].quantity += lot.quantity;
    });

    // Statistiques de qualité
    let totalGermination = 0;
    let totalPurity = 0;
    let controlCount = 0;

    lots.forEach((lot) => {
      lot.qualityControls.forEach((control) => {
        totalGermination += control.germinationRate;
        totalPurity += control.varietyPurity;
        controlCount++;
      });
    });

    const qualityStats = {
      averageGermination:
        controlCount > 0 ? totalGermination / controlCount : 0,
      averagePurity: controlCount > 0 ? totalPurity / controlCount : 0,
      controlCount,
    };

    // Préparer le rapport
    const report = {
      variety: {
        id: variety.id,
        name: variety.name,
        description: variety.description,
        origin: variety.origin,
        creationDate: variety.creationDate,
      },
      lotStats: {
        totalLots: lots.length,
        totalQuantity: lots.reduce((sum, lot) => sum + lot.quantity, 0),
        byLevel: levelStats,
      },
      qualityStats,
      recentLots: lots.slice(0, 5).map((lot) => ({
        id: lot.id,
        level: lot.level,
        quantity: lot.quantity,
        productionDate: lot.productionDate,
        status: lot.status,
      })),
    };

    return res.json(report);
  } catch (error) {
    console.error("Get variety report error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération du rapport de la variété",
      });
  }
};
