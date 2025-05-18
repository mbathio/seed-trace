import { Request, Response } from "express";
import { prisma } from "../app";

// Obtenir toutes les variétés de semences
export const getAllSeedVarieties = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const seedVarieties = await prisma.seedVariety.findMany({
      where: filters,
      orderBy: { name: "asc" },
    });

    return res.json(seedVarieties);
  } catch (error) {
    console.error("Get all seed varieties error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des variétés de semences",
      });
  }
};

// Obtenir une variété de semences par son ID
export const getSeedVarietyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seedVariety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(id) },
      include: {
        lots: true,
      },
    });

    if (!seedVariety) {
      return res
        .status(404)
        .json({ message: "Variété de semences non trouvée" });
    }

    return res.json(seedVariety);
  } catch (error) {
    console.error("Get seed variety by ID error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération de la variété de semences",
      });
  }
};

// Créer une nouvelle variété de semences
export const createSeedVariety = async (req: Request, res: Response) => {
  try {
    const { name, description, origin, creationDate } = req.body;

    if (!name || !creationDate) {
      return res
        .status(400)
        .json({ message: "Le nom et la date de création sont obligatoires" });
    }

    // Vérifier si la variété existe déjà
    const existingVariety = await prisma.seedVariety.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existingVariety) {
      return res
        .status(400)
        .json({ message: "Une variété avec ce nom existe déjà" });
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

    return res.status(201).json(newSeedVariety);
  } catch (error) {
    console.error("Create seed variety error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la création de la variété de semences",
      });
  }
};

// Mettre à jour une variété de semences
export const updateSeedVariety = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, origin, creationDate } = req.body;

    // Vérifier si la variété existe
    const existingVariety = await prisma.seedVariety.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVariety) {
      return res
        .status(404)
        .json({ message: "Variété de semences non trouvée" });
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
        return res
          .status(400)
          .json({ message: "Une variété avec ce nom existe déjà" });
      }
    }

    // Mettre à jour la variété
    const updatedSeedVariety = await prisma.seedVariety.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        origin,
        creationDate: creationDate ? new Date(creationDate) : undefined,
      },
    });

    return res.json(updatedSeedVariety);
  } catch (error) {
    console.error("Update seed variety error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour de la variété de semences",
      });
  }
};

// Supprimer une variété de semences
export const deleteSeedVariety = async (req: Request, res: Response) => {
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
      return res
        .status(404)
        .json({ message: "Variété de semences non trouvée" });
    }

    // Vérifier si la variété a des lots associés
    if (existingVariety.lots.length > 0) {
      return res.status(400).json({
        message:
          "Impossible de supprimer cette variété car elle est associée à des lots de semences",
        lots: existingVariety.lots,
      });
    }

    // Supprimer la variété
    await prisma.seedVariety.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: "Variété de semences supprimée avec succès" });
  } catch (error) {
    console.error("Delete seed variety error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la suppression de la variété de semences",
      });
  }
};
