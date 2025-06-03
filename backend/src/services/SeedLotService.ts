// backend/src/services/SeedLotService.ts
import { prisma } from "../config/database";
import { EncryptionService } from "../utils/encryption";
import { QRCodeService } from "../utils/qrCode";
import { logger } from "../utils/logger";
import { CreateSeedLotData, UpdateSeedLotData } from "../types/entities";
import { PaginationQuery } from "../types/api";
import { SeedLevel, LotStatus } from "@prisma/client"; // ✅ Import des enums

export class SeedLotService {
  static async createSeedLot(data: CreateSeedLotData): Promise<any> {
    try {
      // Générer un ID unique pour le lot
      const lotId = EncryptionService.generateLotId(data.level);

      // ✅ Gestion correcte de varietyId (number ou string)
      let varietyId: number;
      if (typeof data.varietyId === "string") {
        // Si c'est un string, essayer de le parser comme nombre
        const parsedId = parseInt(data.varietyId);
        if (!isNaN(parsedId)) {
          varietyId = parsedId;
        } else {
          // Si ce n'est pas un nombre, chercher par code
          const variety = await prisma.variety.findFirst({
            where: { code: data.varietyId },
          });
          if (!variety) {
            throw new Error(
              `Variété non trouvée avec le code: ${data.varietyId}`
            );
          }
          varietyId = variety.id;
        }
      } else {
        varietyId = data.varietyId;
      }

      // Créer le lot de semences
      const seedLot = await prisma.seedLot.create({
        data: {
          id: lotId,
          varietyId,
          level: data.level as SeedLevel, // ✅ Cast vers l'enum
          quantity: data.quantity,
          productionDate: new Date(data.productionDate),
          multiplierId: data.multiplierId,
          parcelId: data.parcelId,
          parentLotId: data.parentLotId,
          notes: data.notes,
          status: LotStatus.PENDING, // ✅ Utilisation de l'enum
        },
        include: {
          variety: true,
          multiplier: true,
          parcel: true,
          parentLot: true,
        },
      });

      // Générer le QR code
      const qrCodeData = await QRCodeService.generateQRCode({
        lotId: seedLot.id,
        varietyName: seedLot.variety.name,
        level: seedLot.level,
        timestamp: new Date().toISOString(),
      });

      // Mettre à jour le lot avec le QR code
      const updatedSeedLot = await prisma.seedLot.update({
        where: { id: lotId },
        data: { qrCode: qrCodeData },
        include: {
          variety: true,
          multiplier: true,
          parcel: true,
          parentLot: true,
        },
      });

      return updatedSeedLot;
    } catch (error) {
      logger.error("Erreur lors de la création du lot:", error);
      throw error;
    }
  }

  static async getSeedLots(
    query: PaginationQuery & any
  ): Promise<{ lots: any[]; total: number; meta: any }> {
    try {
      const {
        page = 1,
        pageSize = 10,
        search,
        level,
        status,
        varietyId,
        multiplierId,
        sortBy = "productionDate",
        sortOrder = "desc",
      } = query;

      const skip = (page - 1) * pageSize;

      const where: any = {
        isActive: true,
      };

      if (search) {
        where.OR = [
          { id: { contains: search, mode: "insensitive" } },
          { variety: { name: { contains: search, mode: "insensitive" } } },
          { notes: { contains: search, mode: "insensitive" } },
        ];
      }

      if (level) {
        where.level = level;
      }

      if (status) {
        where.status = status;
      }

      // ✅ Gestion améliorée de varietyId
      if (varietyId) {
        if (typeof varietyId === "string") {
          const parsedId = parseInt(varietyId);
          if (!isNaN(parsedId)) {
            where.varietyId = parsedId;
          } else {
            // Recherche par code
            where.variety = { code: varietyId };
          }
        } else {
          where.varietyId = varietyId;
        }
      }

      if (multiplierId) {
        where.multiplierId = parseInt(multiplierId);
      }

      const [lots, total] = await Promise.all([
        prisma.seedLot.findMany({
          where,
          include: {
            variety: true,
            multiplier: true,
            parcel: true,
            parentLot: true,
            qualityControls: {
              orderBy: { controlDate: "desc" },
              take: 1,
            },
            _count: {
              select: {
                childLots: true,
                qualityControls: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: pageSize,
        }),
        prisma.seedLot.count({ where }),
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        lots,
        total,
        meta: {
          page,
          pageSize,
          totalCount: total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error("Erreur lors de la récupération des lots:", error);
      throw error;
    }
  }

  static async getSeedLotById(id: string): Promise<any> {
    try {
      const seedLot = await prisma.seedLot.findUnique({
        where: { id, isActive: true },
        include: {
          variety: true,
          multiplier: true,
          parcel: true,
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
            include: {
              inspector: {
                select: { id: true, name: true, email: true },
              },
            },
            orderBy: { controlDate: "desc" },
          },
          productions: {
            include: {
              multiplier: true,
              parcel: true,
            },
            orderBy: { startDate: "desc" },
          },
        },
      });

      return seedLot;
    } catch (error) {
      logger.error("Erreur lors de la récupération du lot:", error);
      throw error;
    }
  }

  static async updateSeedLot(
    id: string,
    data: UpdateSeedLotData
  ): Promise<any> {
    try {
      const updateData: any = {};

      if (data.quantity !== undefined) {
        updateData.quantity = data.quantity;
      }

      if (data.status) {
        updateData.status = data.status as LotStatus; // ✅ Cast vers l'enum
      }

      if (data.notes !== undefined) {
        updateData.notes = data.notes;
      }

      if (data.expiryDate) {
        updateData.expiryDate = new Date(data.expiryDate);
      }

      updateData.updatedAt = new Date();

      const seedLot = await prisma.seedLot.update({
        where: { id },
        data: updateData,
        include: {
          variety: true,
          multiplier: true,
          parcel: true,
          parentLot: true,
        },
      });

      return seedLot;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour du lot:", error);
      throw error;
    }
  }

  static async deleteSeedLot(id: string): Promise<void> {
    try {
      await prisma.seedLot.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      logger.error("Erreur lors de la suppression du lot:", error);
      throw error;
    }
  }

  static async getGenealogyTree(lotId: string): Promise<any> {
    try {
      const lot = await this.getSeedLotById(lotId);
      if (!lot) {
        return null;
      }

      // Récupérer tous les ancêtres
      const ancestors = await this.getAncestors(lotId);

      // Récupérer tous les descendants
      const descendants = await this.getDescendants(lotId);

      return {
        currentLot: lot,
        ancestors,
        descendants,
      };
    } catch (error) {
      logger.error("Erreur lors de la récupération de la généalogie:", error);
      throw error;
    }
  }

  private static async getAncestors(lotId: string): Promise<any[]> {
    const ancestors = [];
    let currentLotId = lotId;

    while (currentLotId) {
      const lot = await prisma.seedLot.findUnique({
        where: { id: currentLotId },
        include: { variety: true, parentLot: true },
      });

      if (!lot || !lot.parentLotId) {
        break;
      }

      ancestors.push(lot.parentLot);
      currentLotId = lot.parentLotId;
    }

    return ancestors;
  }

  private static async getDescendants(lotId: string): Promise<any[]> {
    const descendants = await prisma.seedLot.findMany({
      where: { parentLotId: lotId },
      include: {
        variety: true,
        childLots: {
          include: { variety: true },
        },
      },
    });

    // Récupérer récursivement les descendants de chaque descendant
    for (const descendant of descendants) {
      descendant.childLots = await this.getDescendants(descendant.id);
    }

    return descendants;
  }
}
