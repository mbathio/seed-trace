// backend/src/services/ProductionService.ts (corrigé)
import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { PaginationQuery } from "../types/api";

export class ProductionService {
  static async createProduction(data: any): Promise<any> {
    try {
      const production = await prisma.production.create({
        data: {
          lotId: data.lotId,
          multiplierId: data.multiplierId,
          parcelId: data.parcelId,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          sowingDate: data.sowingDate ? new Date(data.sowingDate) : undefined, // Changé de null à undefined
          harvestDate: data.harvestDate
            ? new Date(data.harvestDate)
            : undefined,
          plannedQuantity: data.plannedQuantity,
          actualYield: data.actualYield,
          notes: data.notes,
          weatherConditions: data.weatherConditions,
        },
        include: {
          seedLot: {
            include: {
              variety: true,
            },
          },
          multiplier: true,
          parcel: true,
        },
      });

      return production;
    } catch (error) {
      logger.error("Erreur lors de la création de la production:", error);
      throw error;
    }
  }

  // ... (le reste des méthodes reste identique)
  static async getProductions(
    query: PaginationQuery & any
  ): Promise<{ productions: any[]; total: number; meta: any }> {
    try {
      const {
        page = 1,
        pageSize = 10,
        search,
        status,
        multiplierId,
        sortBy = "startDate",
        sortOrder = "desc",
      } = query;

      const skip = (page - 1) * pageSize;

      const where: any = {};

      if (search) {
        where.OR = [
          { seedLot: { id: { contains: search, mode: "insensitive" } } },
          { notes: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (multiplierId) {
        where.multiplierId = parseInt(multiplierId);
      }

      const [productions, total] = await Promise.all([
        prisma.production.findMany({
          where,
          include: {
            seedLot: {
              include: {
                variety: true,
              },
            },
            multiplier: true,
            parcel: true,
            activities: {
              orderBy: { activityDate: "desc" },
              take: 3,
            },
            issues: {
              where: { resolved: false },
              take: 3,
            },
            _count: {
              select: {
                activities: true,
                issues: true,
                weatherData: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.production.count({ where }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        productions,
        total,
        meta: {
          page,
          pageSize,
          totalCount: total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error("Erreur lors de la récupération des productions:", error);
      throw error;
    }
  }

  static async getProductionById(id: number): Promise<any> {
    try {
      const production = await prisma.production.findUnique({
        where: { id },
        include: {
          seedLot: {
            include: {
              variety: true,
            },
          },
          multiplier: true,
          parcel: {
            include: {
              soilAnalyses: {
                orderBy: { analysisDate: "desc" },
                take: 1,
              },
            },
          },
          activities: {
            include: {
              user: {
                select: { id: true, name: true },
              },
              inputs: true,
            },
            orderBy: { activityDate: "desc" },
          },
          issues: {
            orderBy: { issueDate: "desc" },
          },
          weatherData: {
            orderBy: { recordDate: "desc" },
          },
        },
      });

      return production;
    } catch (error) {
      logger.error("Erreur lors de la récupération de la production:", error);
      throw error;
    }
  }

  static async updateProduction(id: number, data: any): Promise<any> {
    try {
      const production = await prisma.production.update({
        where: { id },
        data: {
          ...data,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          sowingDate: data.sowingDate ? new Date(data.sowingDate) : undefined,
          harvestDate: data.harvestDate
            ? new Date(data.harvestDate)
            : undefined,
          updatedAt: new Date(),
        },
        include: {
          seedLot: {
            include: {
              variety: true,
            },
          },
          multiplier: true,
          parcel: true,
        },
      });

      return production;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la production:", error);
      throw error;
    }
  }

  static async deleteProduction(id: number): Promise<void> {
    try {
      await prisma.production.delete({
        where: { id },
      });
    } catch (error) {
      logger.error("Erreur lors de la suppression de la production:", error);
      throw error;
    }
  }

  static async addActivity(productionId: number, data: any): Promise<any> {
    try {
      const activity = await prisma.productionActivity.create({
        data: {
          productionId,
          type: data.type,
          activityDate: new Date(data.activityDate),
          description: data.description,
          personnel: data.personnel || [],
          notes: data.notes,
          userId: data.userId,
          inputs: {
            create: data.inputs || [],
          },
        },
        include: {
          user: {
            select: { id: true, name: true },
          },
          inputs: true,
        },
      });

      return activity;
    } catch (error) {
      logger.error("Erreur lors de l'ajout de l'activité:", error);
      throw error;
    }
  }

  static async addIssue(productionId: number, data: any): Promise<any> {
    try {
      const issue = await prisma.productionIssue.create({
        data: {
          productionId,
          issueDate: new Date(data.issueDate),
          type: data.type,
          description: data.description,
          severity: data.severity,
          actions: data.actions,
          cost: data.cost,
        },
      });

      return issue;
    } catch (error) {
      logger.error("Erreur lors de l'ajout du problème:", error);
      throw error;
    }
  }

  static async addWeatherData(productionId: number, data: any): Promise<any> {
    try {
      const weatherData = await prisma.weatherData.create({
        data: {
          productionId,
          recordDate: new Date(data.recordDate),
          temperature: data.temperature,
          rainfall: data.rainfall,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          notes: data.notes,
          source: data.source,
        },
      });

      return weatherData;
    } catch (error) {
      logger.error("Erreur lors de l'ajout des données météo:", error);
      throw error;
    }
  }
}
