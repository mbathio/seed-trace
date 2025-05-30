// backend/src/services/VarietyService.ts - Version corrigée

import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { PaginationQuery } from "../types/api";

export class VarietyService {
  static async createVariety(data: any): Promise<any> {
    try {
      const variety = await prisma.variety.create({
        data: {
          code: data.code, // ✅ Utiliser le code fourni
          name: data.name,
          cropType: data.cropType,
          description: data.description,
          maturityDays: data.maturityDays,
          yieldPotential: data.yieldPotential,
          resistances: data.resistances || [],
          origin: data.origin,
          releaseYear: data.releaseYear,
        },
      });

      return variety;
    } catch (error) {
      logger.error("Erreur lors de la création de la variété:", error);
      throw error;
    }
  }

  static async getVarieties(
    query: PaginationQuery & any
  ): Promise<{ varieties: any[]; total: number; meta: any }> {
    try {
      const {
        page = 1,
        pageSize = 10,
        search,
        cropType,
        sortBy = "name",
        sortOrder = "asc",
      } = query;

      const skip = (page - 1) * pageSize;

      const where: any = {
        isActive: true,
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } }, // ✅ Recherche par code
          { description: { contains: search, mode: "insensitive" } },
          { origin: { contains: search, mode: "insensitive" } },
        ];
      }

      if (cropType) {
        where.cropType = cropType;
      }

      const [varieties, total] = await Promise.all([
        prisma.variety.findMany({
          where,
          include: {
            _count: {
              select: {
                seedLots: {
                  where: { isActive: true },
                },
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.variety.count({ where }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        varieties,
        total,
        meta: {
          page,
          pageSize,
          totalCount: total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error("Erreur lors de la récupération des variétés:", error);
      throw error;
    }
  }

  static async getVarietyById(id: string): Promise<any> {
    try {
      // ✅ Recherche par ID numérique ou par code
      const variety = await prisma.variety.findFirst({
        where: {
          OR: [{ id: isNaN(parseInt(id)) ? -1 : parseInt(id) }, { code: id }],
          isActive: true,
        },
        include: {
          seedLots: {
            where: { isActive: true },
            include: {
              multiplier: true,
              parcel: true,
            },
            orderBy: { productionDate: "desc" },
            take: 10,
          },
          _count: {
            select: {
              seedLots: {
                where: { isActive: true },
              },
            },
          },
        },
      });

      return variety;
    } catch (error) {
      logger.error("Erreur lors de la récupération de la variété:", error);
      throw error;
    }
  }

  static async updateVariety(id: string, data: any): Promise<any> {
    try {
      const variety = await prisma.variety.updateMany({
        where: {
          OR: [{ id: isNaN(parseInt(id)) ? -1 : parseInt(id) }, { code: id }],
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return variety;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la variété:", error);
      throw error;
    }
  }

  static async deleteVariety(id: string): Promise<void> {
    try {
      await prisma.variety.updateMany({
        where: {
          OR: [{ id: isNaN(parseInt(id)) ? -1 : parseInt(id) }, { code: id }],
        },
        data: { isActive: false },
      });
    } catch (error) {
      logger.error("Erreur lors de la suppression de la variété:", error);
      throw error;
    }
  }
}
