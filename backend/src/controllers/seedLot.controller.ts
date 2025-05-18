import { Request, Response } from "express";
import { prisma } from "../app";
import { SeedLevel, LotStatus } from "@prisma/client";
import QRCode from "qrcode";

// Obtenir tous les lots de semences
export const getAllSeedLots = async (req: Request, res: Response) => {
  try {
    const { level, status, varietyId, search } = req.query;

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

    const seedLots = await prisma.seedLot.findMany({
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
    });

    return res.json(seedLots);
  } catch (error) {
    console.error("Get all seed lots error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des lots de semences" });
  }
};

// Obtenir un lot de semences par son ID
export const getSeedLotById = async (req: Request, res: Response) => {
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
      return res.status(404).json({ message: "Lot de semences non trouvé" });
    }

    return res.json(seedLot);
  } catch (error) {
    console.error("Get seed lot by ID error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du lot de semences" });
  }
};

// Créer un nouveau lot de semences
export const createSeedLot = async (req: Request, res: Response) => {
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

    if (!id || !varietyId || !level || !quantity || !productionDate) {
      return res
        .status(400)
        .json({ message: "Tous les champs obligatoires doivent être fournis" });
    }

    // Vérifier si le lot existe déjà
    const existingLot = await prisma.seedLot.findUnique({ where: { id } });
    if (existingLot) {
      return res
        .status(400)
        .json({ message: "Un lot avec cet identifiant existe déjà" });
    }

    // Vérifier si la variété existe
    const variety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(varietyId) },
    });
    if (!variety) {
      return res.status(400).json({ message: "Variété non trouvée" });
    }

    // Vérifier le lot parent si fourni
    if (parentLotId) {
      const parentLot = await prisma.seedLot.findUnique({
        where: { id: parentLotId },
      });
      if (!parentLot) {
        return res.status(400).json({ message: "Lot parent non trouvé" });
      }
    }

    // Générer le QR Code
    const qrCodeData = JSON.stringify({
      id,
      variety: variety.name,
      level,
      productionDate,
      timestamp: new Date().toISOString(),
    });

    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Créer le lot
    const newSeedLot = await prisma.seedLot.create({
      data: {
        id,
        varietyId: parseInt(varietyId),
        parentLotId,
        level: level as SeedLevel,
        quantity: parseFloat(quantity),
        productionDate: new Date(productionDate),
        status: status as LotStatus,
        qrCode: qrCodeUrl,
      },
    });

    return res.status(201).json(newSeedLot);
  } catch (error) {
    console.error("Create seed lot error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création du lot de semences" });
  }
};

// Mettre à jour un lot de semences (suite)
export const updateSeedLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { varietyId, parentLotId, level, quantity, productionDate, status } =
      req.body;

    // Vérifier si le lot existe
    const existingLot = await prisma.seedLot.findUnique({ where: { id } });
    if (!existingLot) {
      return res.status(404).json({ message: "Lot de semences non trouvé" });
    }

    // Mettre à jour le lot
    const updatedSeedLot = await prisma.seedLot.update({
      where: { id },
      data: {
        varietyId: varietyId ? parseInt(varietyId) : undefined,
        parentLotId,
        level: level as SeedLevel,
        quantity: quantity ? parseFloat(quantity) : undefined,
        productionDate: productionDate ? new Date(productionDate) : undefined,
        status: status as LotStatus,
      },
    });

    return res.json(updatedSeedLot);
  } catch (error) {
    console.error("Update seed lot error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du lot de semences" });
  }
};

// Supprimer un lot de semences
export const deleteSeedLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le lot existe
    const existingLot = await prisma.seedLot.findUnique({ where: { id } });
    if (!existingLot) {
      return res.status(404).json({ message: "Lot de semences non trouvé" });
    }

    // Vérifier si le lot a des lots descendants
    const childLots = await prisma.seedLot.findMany({
      where: { parentLotId: id },
    });
    if (childLots.length > 0) {
      return res.status(400).json({
        message:
          "Impossible de supprimer ce lot car il possède des lots descendants",
      });
    }

    // Supprimer les contrôles qualité associés
    await prisma.qualityControl.deleteMany({ where: { lotId: id } });

    // Supprimer les productions associées
    await prisma.production.deleteMany({ where: { lotId: id } });

    // Supprimer les distributions associées
    await prisma.distributedLot.deleteMany({ where: { lotId: id } });

    // Supprimer le lot
    await prisma.seedLot.delete({ where: { id } });

    return res.json({ message: "Lot de semences supprimé avec succès" });
  } catch (error) {
    console.error("Delete seed lot error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression du lot de semences" });
  }
};

// Obtenir la généalogie d'un lot
export const getSeedLotGenealogy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le lot existe
    const seedLot = await prisma.seedLot.findUnique({ where: { id } });
    if (!seedLot) {
      return res.status(404).json({ message: "Lot de semences non trouvé" });
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

      if (lot.parentLotId) {
        ancestors.push(lot.parentLot);
        return findAncestors(lot.parentLotId, ancestors);
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

      const allDescendants = [...childLots];

      for (const child of childLots) {
        const descendants = await findDescendants(child.id);
        allDescendants.push(...descendants);
      }

      return allDescendants;
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

    // Combiner tous les lots
    const genealogy = {
      current: currentLot,
      ancestors,
      descendants,
    };

    return res.json(genealogy);
  } catch (error) {
    console.error("Get seed lot genealogy error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération de la généalogie du lot",
    });
  }
};

// Générer un QR code pour un lot
export const generateQRCode = async (req: Request, res: Response) => {
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
      return res.status(404).json({ message: "Lot de semences non trouvé" });
    }

    // Données pour le QR code
    const qrCodeData = JSON.stringify({
      id: seedLot.id,
      variety: seedLot.variety.name,
      level: seedLot.level,
      productionDate: seedLot.productionDate,
      timestamp: new Date().toISOString(),
    });

    // Générer le QR code
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    // Mettre à jour le lot avec le nouveau QR code
    await prisma.seedLot.update({
      where: { id },
      data: { qrCode: qrCodeUrl },
    });

    return res.json({ qrCode: qrCodeUrl });
  } catch (error) {
    console.error("Generate QR code error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la génération du QR code" });
  }
};
