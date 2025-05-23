// backend/src/services/MultiplierService.ts
import { prisma } from "../config/database";
import { logger } from "../utils/logger";
import { PaginationQuery } from "../types/api";

export class MultiplierService {
  static async createMultiplier(data: any): Promise<any> {
    try {
      const multiplier = await prisma.multiplier.create({
        data: {
          name: data.name,
          status: data.status || "active",
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          yearsExperience: data.yearsExperience,
          certificationLevel: data.certificationLevel,
          specialization: data.specialization || [],
          phone: data.phone,
          email: data.email,
        },
      });

      return multiplier;
    } catch (error) {
      logger.error("Erreur lors de la création du multiplicateur:", error);
      throw error;
    }
  }

  static async getMultipliers(
    query: PaginationQuery & any
  ): Promise<{ multipliers: any[]; total: number; meta: any }> {
    try {
      const {
        page = 1,
        pageSize = 10,
        search,
        status,
        certificationLevel,
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
          { address: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (certificationLevel) {
        where.certificationLevel = certificationLevel;
      }

      const [multipliers, total] = await Promise.all([
        prisma.multiplier.findMany({
          where,
          include: {
            _count: {
              select: {
                parcels: true,
                contracts: true,
                seedLots: true,
                productions: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.multiplier.count({ where }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        multipliers,
        total,
        meta: {
          page,
          pageSize,
          totalCount: total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error(
        "Erreur lors de la récupération des multiplicateurs:",
        error
      );
      throw error;
    }
  }

  static async getMultiplierById(id: number): Promise<any> {
    try {
      const multiplier = await prisma.multiplier.findUnique({
        where: { id, isActive: true },
        include: {
          parcels: {
            include: {
              soilAnalyses: {
                orderBy: { analysisDate: "desc" },
                take: 1,
              },
            },
          },
          contracts: {
            include: {
              variety: true,
            },
            orderBy: { startDate: "desc" },
          },
          seedLots: {
            include: {
              variety: true,
            },
            orderBy: { productionDate: "desc" },
            take: 10,
          },
          productions: {
            include: {
              seedLot: {
                include: {
                  variety: true,
                },
              },
              parcel: true,
            },
            orderBy: { startDate: "desc" },
            take: 10,
          },
          history: {
            orderBy: { year: "desc" },
            take: 5,
          },
        },
      });

      return multiplier;
    } catch (error) {
      logger.error("Erreur lors de la récupération du multiplicateur:", error);
      throw error;
    }
  }

  static async updateMultiplier(id: number, data: any): Promise<any> {
    try {
      const multiplier = await prisma.multiplier.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return multiplier;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour du multiplicateur:", error);
      throw error;
    }
  }

  static async deleteMultiplier(id: number): Promise<void> {
    try {
      await prisma.multiplier.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      logger.error("Erreur lors de la suppression du multiplicateur:", error);
      throw error;
    }
  }

  static async getMultiplierContracts(multiplierId: number): Promise<any[]> {
    try {
      const contracts = await prisma.contract.findMany({
        where: { multiplierId },
        include: {
          variety: true,
        },
        orderBy: { startDate: "desc" },
      });

      return contracts;
    } catch (error) {
      logger.error("Erreur lors de la récupération des contrats:", error);
      throw error;
    }
  }

  static async createContract(data: any): Promise<any> {
    try {
      const contract = await prisma.contract.create({
        data: {
          multiplierId: data.multiplierId,
          varietyId: data.varietyId,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          seedLevel: data.seedLevel,
          expectedQuantity: data.expectedQuantity,
          parcelId: data.parcelId,
          paymentTerms: data.paymentTerms,
          notes: data.notes,
        },
        include: {
          variety: true,
          multiplier: true,
        },
      });

      return contract;
    } catch (error) {
      logger.error("Erreur lors de la création du contrat:", error);
      throw error;
    }
  }
}
