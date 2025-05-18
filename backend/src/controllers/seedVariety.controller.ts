// backend/src/controllers/seedVariety.controller.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../app";
import { ValidationError, NotFoundError, ConflictError } from "../types/errors";
import Logger from "../services/logging.service";
import {
  AuditService,
  AuditAction,
  AuditEntity,
} from "../services/audit.service";

// Obtenir toutes les variétés de semences
export const getAllSeedVarieties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;
    const pagination = req.pagination || { skip: 0, limit: 10, page: 1 };

    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Récupérer les variétés avec pagination
    const [seedVarieties, total] = await Promise.all([
      prisma.seedVariety.findMany({
        where: filters,
        orderBy: { name: "asc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
      prisma.seedVariety.count({ where: filters }),
    ]);

    return res.json({
      data: seedVarieties,
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

// Obtenir une variété de semences par son ID
export const getSeedVarietyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const seedVariety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(id) },
      include: {
        lots: {
          select: {
            id: true,
            level: true,
            quantity: true,
            productionDate: true,
            status: true,
          },
          orderBy: {
            productionDate: "desc",
          },
          take: 10, // Limiter à 10 lots pour éviter de surcharger la réponse
        },
        _count: {
          select: {
            lots: true,
          },
        },
      },
    });

    if (!seedVariety) {
      throw new NotFoundError("Variété de semences non trouvée");
    }

    // Enregistrer l'audit de lecture
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.READ,
        entity: AuditEntity.SEED_VARIETY,
        entityId: parseInt(id),
        ipAddress: req.ip,
      });
    }

    return res.json(seedVariety);
  } catch (error) {
    next(error);
  }
};

// Créer une nouvelle variété de semences
export const createSeedVariety = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, origin, creationDate } = req.body;

    // Vérifier si la variété existe déjà
    const existingVariety = await prisma.seedVariety.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingVariety) {
      throw new ConflictError("Une variété avec ce nom existe déjà", "name");
    }

    // Créer la variété
    const newSeedVariety = await prisma.seedVariety.create({
      data: {
        name,
        description,
        origin,
        creationDate: new Date(creationDate),
      },
    });

    // Enregistrer l'audit de création
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.CREATE,
        entity: AuditEntity.SEED_VARIETY,
        entityId: newSeedVariety.id,
        details: {
          name: newSeedVariety.name,
          origin: newSeedVariety.origin,
        },
        ipAddress: req.ip,
      });
    }

    // Logger la création de la variété
    Logger.info(
      `Variety ${newSeedVariety.id} (${newSeedVariety.name}) created`,
      "SeedVariety",
      {
        name: newSeedVariety.name,
        origin: newSeedVariety.origin,
        creationDate: newSeedVariety.creationDate,
      },
      req.user?.id,
      req.ip
    );

    return res.status(201).json(newSeedVariety);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour une variété de semences
export const updateSeedVariety = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, origin, creationDate } = req.body;

    // Vérifier si la variété existe
    const existingVariety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVariety) {
      throw new NotFoundError("Variété de semences non trouvée");
    }

    // Si le nom est modifié, vérifier s'il existe déjà
    if (name && name !== existingVariety.name) {
      const nameExists = await prisma.seedVariety.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
          id: { not: parseInt(id) },
        },
      });

      if (nameExists) {
        throw new ConflictError("Une variété avec ce nom existe déjà", "name");
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (origin !== undefined) updateData.origin = origin;
    if (creationDate) updateData.creationDate = new Date(creationDate);

    // Mettre à jour la variété
    const updatedSeedVariety = await prisma.seedVariety.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // Enregistrer l'audit de mise à jour
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.UPDATE,
        entity: AuditEntity.SEED_VARIETY,
        entityId: updatedSeedVariety.id,
        details: updateData,
        ipAddress: req.ip,
      });
    }

    // Logger la mise à jour de la variété
    Logger.info(
      `Variety ${updatedSeedVariety.id} (${updatedSeedVariety.name}) updated`,
      "SeedVariety",
      updateData,
      req.user?.id,
      req.ip
    );

    return res.json(updatedSeedVariety);
  } catch (error) {
    next(error);
  }
};

// Supprimer une variété de semences
export const deleteSeedVariety = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Vérifier si la variété existe
    const existingVariety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(id) },
      include: {
        lots: true,
      },
    });

    if (!existingVariety) {
      throw new NotFoundError("Variété de semences non trouvée");
    }

    // Vérifier si la variété a des lots associés
    if (existingVariety.lots.length > 0) {
      throw new ValidationError(
        "Impossible de supprimer cette variété car elle est associée à des lots de semences",
        "id"
      );
    }

    // Supprimer la variété
    await prisma.seedVariety.delete({
      where: { id: parseInt(id) },
    });

    // Enregistrer l'audit de suppression
    if (req.user) {
      await AuditService.createAudit({
        userId: req.user.id,
        action: AuditAction.DELETE,
        entity: AuditEntity.SEED_VARIETY,
        entityId: parseInt(id),
        details: {
          name: existingVariety.name,
        },
        ipAddress: req.ip,
      });
    }

    // Logger la suppression de la variété
    Logger.info(
      `Variety ${id} (${existingVariety.name}) deleted`,
      "SeedVariety",
      {},
      req.user?.id,
      req.ip
    );

    return res.json({
      message: "Variété de semences supprimée avec succès",
      data: {
        id: parseInt(id),
        name: existingVariety.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
