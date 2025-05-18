// backend/src/controllers/seedLot.controller.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../app";
import { SeedLevel, LotStatus } from "@prisma/client";
import QRService from "../services/qr.service";
import { ValidationError, NotFoundError, ConflictError } from "../types/errors";
import Logger from "../services/logging.service";
import {
  AuditService,
  AuditAction,
  AuditEntity,
} from "../services/audit.service";

// Obtenir tous les lots de semences
export const getAllSeedLots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { level, status, varietyId, search } = req.query;
    const pagination = req.pagination || { skip: 0, limit: 10, page: 1 };

    const filters: any = {};

    if (level) {
      filters.level = level as SeedLevel;
    }

    if (status) {
      filters.status = status as LotStatus;
    }

    if (varietyId) {
      filters.varietyId = parseInt(varietyId as string, 10);
    }

    if (search) {
      filters.OR = [
        { id: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Récupérer les lots avec pagination
    const [seedLots, total] = await Promise.all([
      prisma.seedLot.findMany({
        where: filters,
        include: {
          variety: true,
          parentLot: {
            select: {
              id: true,
              level: true,
            },
          },
        },
        orderBy: { productionDate: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.seedLot.count({ where: filters }),
    ]);

    return res.json({
      data: seedLots,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir un lot de semences par son ID
export const getSeedLotById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const seedLot = await prisma.seedLot.findUnique({
      where: { id },
      include: {
        variety: true,
        parentLot: {
          select: {
            id: true,
            level: true,
            variety: true,
          },
        },
        qualityControls: {
          orderBy: { controlDate: "desc" },
        },
      },
    });

    if (!seedLot) {
      throw new NotFoundError("Lot de semences non trouvé");
    }

    // Enregistrer l'audit de lecture
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.READ,
        entity: AuditEntity.SEED_LOT,
        entityId: id,
        ipAddress: req.ip,
      });
    }

    return res.json(seedLot);
  } catch (error) {
    next(error);
  }
};

// Créer un nouveau lot de semences
export const createSeedLot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      id,
      varietyId,
      parentLotId,
      level,
      quantity,
      productionDate,
      status = LotStatus.ACTIVE,
    } = req.body;

    // Vérifier si le lot existe déjà
    const existingLot = await prisma.seedLot.findUnique({ where: { id } });
    if (existingLot) {
      throw new ConflictError("Un lot avec cet identifiant existe déjà", "id");
    }

    // Vérifier si la variété existe
    const variety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(varietyId) },
    });
    if (!variety) {
      throw new ValidationError("Variété non trouvée", "varietyId");
    }

    // Vérifier le lot parent si fourni
    if (parentLotId) {
      const parentLot = await prisma.seedLot.findUnique({
        where: { id: parentLotId },
      });
      if (!parentLot) {
        throw new ValidationError("Lot parent non trouvé", "parentLotId");
      }

      // Vérifier que le niveau est cohérent avec le niveau parent
      const levelOrder = {
        GO: 0,
        G1: 1,
        G2: 2,
        G3: 3,
        R1: 4,
        R2: 5,
      };

      const parentLevelIndex = levelOrder[parentLot.level];
      const targetLevelIndex = levelOrder[level as SeedLevel];

      if (targetLevelIndex <= parentLevelIndex) {
        throw new ValidationError(
          `Le niveau cible (${level}) doit être supérieur au niveau parent (${parentLot.level})`,
          "level"
        );
      }

      // Vérifier que la variété est la même que celle du parent
      if (parentLot.varietyId !== parseInt(varietyId)) {
        throw new ValidationError(
          "La variété doit être la même que celle du lot parent",
          "varietyId"
        );
      }
    }

    // Générer le QR Code
    const qrCodeUrl = await QRService.generateSeedLotQR(
      id,
      variety.name,
      level as SeedLevel,
      new Date(productionDate)
    );

    // Créer le lot
    const newSeedLot = await prisma.seedLot.create({
      data: {
        id,
        varietyId: parseInt(varietyId),
        parentLotId,
        level: level as SeedLevel,
        quantity: parseFloat(quantity.toString()),
        productionDate: new Date(productionDate),
        status: status as LotStatus,
        qrCode: qrCodeUrl,
      },
    });

    // Enregistrer l'audit de création
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.CREATE,
        entity: AuditEntity.SEED_LOT,
        entityId: newSeedLot.id,
        details: {
          varietyId: newSeedLot.varietyId,
          level: newSeedLot.level,
          quantity: newSeedLot.quantity,
        },
        ipAddress: req.ip,
      });
    }

    // Logger la création du lot
    Logger.info(
      `Lot ${newSeedLot.id} created with level ${newSeedLot.level}`,
      "SeedLot",
      {
        varietyId: newSeedLot.varietyId,
        parentLotId: newSeedLot.parentLotId,
        quantity: newSeedLot.quantity,
      },
      req.user?.id,
      req.ip
    );

    return res.status(201).json(newSeedLot);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un lot de semences
export const updateSeedLot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { varietyId, parentLotId, level, quantity, productionDate, status } =
      req.body;

    // Vérifier si le lot existe
    const existingLot = await prisma.seedLot.findUnique({ where: { id } });
    if (!existingLot) {
      throw new NotFoundError("Lot de semences non trouvé");
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    // Vérifier et ajouter la variété si fournie
    if (varietyId) {
      const variety = await prisma.seedVariety.findUnique({
        where: { id: parseInt(varietyId) },
      });
      if (!variety) {
        throw new ValidationError("Variété non trouvée", "varietyId");
      }
      updateData.varietyId = parseInt(varietyId);
    }

    // Vérifier et ajouter le lot parent si fourni
    if (parentLotId) {
      const parentLot = await prisma.seedLot.findUnique({
        where: { id: parentLotId },
      });
      if (!parentLot) {
        throw new ValidationError("Lot parent non trouvé", "parentLotId");
      }
      updateData.parentLotId = parentLotId;
    }

    // Ajouter les autres champs
    if (level) updateData.level = level as SeedLevel;
    if (quantity !== undefined)
      updateData.quantity = parseFloat(quantity.toString());
    if (productionDate) updateData.productionDate = new Date(productionDate);
    if (status) updateData.status = status as LotStatus;

    // Mettre à jour le lot
    const updatedSeedLot = await prisma.seedLot.update({
      where: { id },
      data: updateData,
    });

    // Enregistrer l'audit de mise à jour
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.UPDATE,
        entity: AuditEntity.SEED_LOT,
        entityId: updatedSeedLot.id,
        details: updateData,
        ipAddress: req.ip,
      });
    }

    // Logger la mise à jour du lot
    Logger.info(
      `Lot ${updatedSeedLot.id} updated`,
      "SeedLot",
      updateData,
      req.user?.id,
      req.ip
    );

    return res.json(updatedSeedLot);
  } catch (error) {
    next(error);
  }
};

// Supprimer un lot de semences
export const deleteSeedLot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Vérifier si le lot existe
    const existingLot = await prisma.seedLot.findUnique({
      where: { id },
      include: {
        childLots: true,
        qualityControls: true,
        productions: true,
        distributedLots: true,
      },
    });

    if (!existingLot) {
      throw new NotFoundError("Lot de semences non trouvé");
    }

    // Vérifier si le lot a des lots descendants
    if (existingLot.childLots.length > 0) {
      throw new ValidationError(
        "Impossible de supprimer ce lot car il possède des lots descendants",
        "id"
      );
    }

    // Transaction pour supprimer le lot et toutes ses dépendances
    await prisma.$transaction(async (prisma) => {
      // Supprimer les contrôles qualité associés
      await prisma.qualityControl.deleteMany({ where: { lotId: id } });

      // Supprimer les productions associées
      await prisma.production.deleteMany({ where: { lotId: id } });

      // Supprimer les distributions associées
      await prisma.distributedLot.deleteMany({ where: { lotId: id } });

      // Supprimer le lot
      await prisma.seedLot.delete({ where: { id } });
    });

    // Enregistrer l'audit de suppression
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.DELETE,
        entity: AuditEntity.SEED_LOT,
        entityId: id,
        ipAddress: req.ip,
      });
    }

    // Logger la suppression du lot
    Logger.info(`Lot ${id} deleted`, "SeedLot", {}, req.user?.id, req.ip);

    return res.json({
      message: "Lot de semences supprimé avec succès",
      data: {
        id,
        qualityControlsRemoved: existingLot.qualityControls.length,
        productionsRemoved: existingLot.productions.length,
        distributionsRemoved: existingLot.distributedLots.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir la généalogie d'un lot
export const getSeedLotGenealogy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Vérifier si le lot existe
    const seedLot = await prisma.seedLot.findUnique({ where: { id } });
    if (!seedLot) {
      throw new NotFoundError("Lot de semences non trouvé");
    }

    // Fonction récursive pour trouver les ancêtres
    const findAncestors = async (
      lotId: string,
      ancestors: any[] = []
    ): Promise<any[]> => {
      const lot = await prisma.seedLot.findUnique({
        where: { id: lotId },
        include: {
          variety: true,
          parentLot: {
            select: {
              id: true,
              level: true,
              variety: true,
            },
          },
        },
      });

      if (!lot) return ancestors;

      if (lot.parentLot) {
        result.parentInfo = {
          id: lot.parentLot.id,
          level: lot.parentLot.level,
          variety: lot.parentLot.variety.name,
        };
      } else {
        result.parentInfo = null;
      }

      return ancestors;
    };

    // Fonction récursive pour trouver les descendants
    const findDescendants = async (lotId: string): Promise<any[]> => {
      const childLots = await prisma.seedLot.findMany({
        where: { parentLotId: lotId },
        include: {
          variety: true,
        },
      });

      if (childLots.length === 0) return [];

      const formattedChildren = childLots.map((child) => ({
        id: child.id,
        level: child.level,
        variety: child.variety.name,
      }));

      const nestedDescendants = await Promise.all(
        childLots.map((child) => findDescendants(child.id))
      );

      // Aplatir le tableau de résultats
      return [...formattedChildren, ...nestedDescendants.flat()];
    };

    // Trouver les ancêtres et descendants
    const ancestors = await findAncestors(id);
    const descendants = await findDescendants(id);

    // Trouver le lot actuel avec ses détails
    const currentLot = await prisma.seedLot.findUnique({
      where: { id },
      include: {
        variety: true,
      },
    });

    if (!currentLot) {
      throw new NotFoundError("Lot de semences non trouvé");
    }

    // Combiner tous les lots
    const genealogy = {
      current: {
        id: currentLot.id,
        level: currentLot.level,
        variety: currentLot.variety.name,
      },
      ancestors,
      descendants,
      totalAncestors: ancestors.length,
      totalDescendants: descendants.length,
    };

    return res.json(genealogy);
  } catch (error) {
    next(error);
  }
};

// Générer un QR code pour un lot
export const generateQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Vérifier si le lot existe
    const seedLot = await prisma.seedLot.findUnique({
      where: { id },
      include: {
        variety: true,
      },
    });

    if (!seedLot) {
      throw new NotFoundError("Lot de semences non trouvé");
    }

    // Générer le QR code
    const qrCodeUrl = await QRService.generateSeedLotQR(
      seedLot.id,
      seedLot.variety.name,
      seedLot.level,
      seedLot.productionDate
    );

    // Mettre à jour le lot avec le nouveau QR code
    await prisma.seedLot.update({
      where: { id },
      data: { qrCode: qrCodeUrl },
    });

    return res.json({ qrCode: qrCodeUrl });
  } catch (error) {
    next(error);
  }
};
