import { Request, Response } from "express";
import { prisma } from "../app";
import { MultiplierStatus, LotStatus } from "@prisma/client";

// Obtenir tous les multiplicateurs
export const getAllMultipliers = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const filters: any = {};

    if (status) {
      filters.status = status as MultiplierStatus;
    }

    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { address: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const multipliers = await prisma.multiplier.findMany({
      where: filters,
      include: {
        _count: {
          select: {
            distributedLots: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return res.json(multipliers);
  } catch (error) {
    console.error("Get all multipliers error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des multiplicateurs" });
  }
};

// Obtenir un multiplicateur par son ID
export const getMultiplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const multiplier = await prisma.multiplier.findUnique({
      where: { id: parseInt(id) },
      include: {
        distributedLots: {
          include: {
            lot: {
              include: {
                variety: true,
              },
            },
          },
          orderBy: {
            distributionDate: "desc",
          },
        },
      },
    });

    if (!multiplier) {
      return res.status(404).json({ message: "Multiplicateur non trouvé" });
    }

    return res.json(multiplier);
  } catch (error) {
    console.error("Get multiplier by ID error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du multiplicateur" });
  }
};

// Créer un nouveau multiplicateur
export const createMultiplier = async (req: Request, res: Response) => {
  try {
    const { name, address, phone, email, status } = req.body;

    if (!name || !address) {
      return res
        .status(400)
        .json({ message: "Le nom et l'adresse sont obligatoires" });
    }

    // Vérifier si un multiplicateur avec le même email existe déjà
    if (email) {
      const existingMultiplier = await prisma.multiplier.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });

      if (existingMultiplier) {
        return res
          .status(400)
          .json({ message: "Un multiplicateur avec cet email existe déjà" });
      }
    }

    // Créer le multiplicateur
    const newMultiplier = await prisma.multiplier.create({
      data: {
        name,
        address,
        phone,
        email,
        status: (status as MultiplierStatus) || MultiplierStatus.ACTIVE,
      },
    });

    return res.status(201).json(newMultiplier);
  } catch (error) {
    console.error("Create multiplier error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création du multiplicateur" });
  }
};

// Mettre à jour un multiplicateur
export const updateMultiplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, phone, email, status } = req.body;

    // Vérifier si le multiplicateur existe
    const existingMultiplier = await prisma.multiplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingMultiplier) {
      return res.status(404).json({ message: "Multiplicateur non trouvé" });
    }

    // Vérifier si l'email est déjà utilisé par un autre multiplicateur
    if (email && email !== existingMultiplier.email) {
      const emailExists = await prisma.multiplier.findFirst({
        where: {
          email: { equals: email, mode: "insensitive" },
          id: { not: parseInt(id) },
        },
      });

      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Un multiplicateur avec cet email existe déjà" });
      }
    }

    // Mettre à jour le multiplicateur
    const updatedMultiplier = await prisma.multiplier.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        phone,
        email,
        status: status as MultiplierStatus,
      },
    });

    return res.json(updatedMultiplier);
  } catch (error) {
    console.error("Update multiplier error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du multiplicateur" });
  }
};

// Supprimer un multiplicateur
export const deleteMultiplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le multiplicateur existe
    const existingMultiplier = await prisma.multiplier.findUnique({
      where: { id: parseInt(id) },
      include: {
        distributedLots: true,
      },
    });

    if (!existingMultiplier) {
      return res.status(404).json({ message: "Multiplicateur non trouvé" });
    }

    // Vérifier si le multiplicateur a des lots distribués
    if (existingMultiplier.distributedLots.length > 0) {
      return res.status(400).json({
        message:
          "Impossible de supprimer ce multiplicateur car il a des lots de semences associés",
        distributedLots: existingMultiplier.distributedLots,
      });
    }

    // Supprimer le multiplicateur
    await prisma.multiplier.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: "Multiplicateur supprimé avec succès" });
  } catch (error) {
    console.error("Delete multiplier error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression du multiplicateur" });
  }
};

// Obtenir les lots distribués à un multiplicateur
export const getMultiplierLots = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le multiplicateur existe
    const multiplier = await prisma.multiplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!multiplier) {
      return res.status(404).json({ message: "Multiplicateur non trouvé" });
    }

    // Obtenir les lots distribués
    const distributedLots = await prisma.distributedLot.findMany({
      where: {
        multiplierId: parseInt(id),
      },
      include: {
        lot: {
          include: {
            variety: true,
          },
        },
      },
      orderBy: {
        distributionDate: "desc",
      },
    });

    return res.json(distributedLots);
  } catch (error) {
    console.error("Get multiplier lots error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des lots du multiplicateur",
      });
  }
};

// Distribuer des lots à un multiplicateur
export const distributeLotsToMultiplier = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { lotId, quantity, distributionDate } = req.body;

    if (!lotId || !quantity || !distributionDate) {
      return res
        .status(400)
        .json({
          message:
            "L'ID du lot, la quantité et la date de distribution sont obligatoires",
        });
    }

    // Vérifier si le multiplicateur existe
    const multiplier = await prisma.multiplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!multiplier) {
      return res.status(404).json({ message: "Multiplicateur non trouvé" });
    }

    // Vérifier si le lot existe
    const seedLot = await prisma.seedLot.findUnique({
      where: { id: lotId },
    });

    if (!seedLot) {
      return res.status(404).json({ message: "Lot de semences non trouvé" });
    }

    // Vérifier si la quantité est disponible
    if (seedLot.quantity < parseFloat(quantity)) {
      return res.status(400).json({
        message: "Quantité insuffisante disponible",
        available: seedLot.quantity,
        requested: parseFloat(quantity),
      });
    }

    // Transaction pour distribuer le lot et mettre à jour la quantité
    const result = await prisma.$transaction(async (prisma) => {
      // Créer la distribution
      const distribution = await prisma.distributedLot.create({
        data: {
          lotId,
          multiplierId: parseInt(id),
          quantity: parseFloat(quantity),
          distributionDate: new Date(distributionDate),
        },
      });

      // Mettre à jour la quantité du lot
      const updatedLot = await prisma.seedLot.update({
        where: { id: lotId },
        data: {
          quantity: seedLot.quantity - parseFloat(quantity),
          status:
            seedLot.quantity - parseFloat(quantity) <= 0
              ? LotStatus.DISTRIBUTED
              : seedLot.status,
        },
      });

      return { distribution, updatedLot };
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Distribute lots error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la distribution des lots" });
  }
};
