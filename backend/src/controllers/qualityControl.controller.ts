import { Request, Response } from "express";
import { prisma } from "../app";
import { TestResult } from "@prisma/client";

// Obtenir tous les contrôles de qualité
export const getAllQualityControls = async (req: Request, res: Response) => {
  try {
    const { result, fromDate, toDate } = req.query;

    const filters: any = {};

    if (result) {
      filters.result = result as TestResult;
    }

    if (fromDate) {
      filters.controlDate = {
        ...(filters.controlDate || {}),
        gte: new Date(fromDate as string),
      };
    }

    if (toDate) {
      filters.controlDate = {
        ...(filters.controlDate || {}),
        lte: new Date(toDate as string),
      };
    }

    const qualityControls = await prisma.qualityControl.findMany({
      where: filters,
      include: {
        lot: {
          include: {
            variety: true,
          },
        },
      },
      orderBy: { controlDate: "desc" },
    });

    return res.json(qualityControls);
  } catch (error) {
    console.error("Get all quality controls error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des contrôles de qualité",
      });
  }
};

// Obtenir un contrôle de qualité par son ID
export const getQualityControlById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const qualityControl = await prisma.qualityControl.findUnique({
      where: { id: parseInt(id) },
      include: {
        lot: {
          include: {
            variety: true,
          },
        },
      },
    });

    if (!qualityControl) {
      return res
        .status(404)
        .json({ message: "Contrôle de qualité non trouvé" });
    }

    return res.json(qualityControl);
  } catch (error) {
    console.error("Get quality control by ID error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la récupération du contrôle de qualité",
      });
  }
};

// Obtenir les contrôles de qualité par lot
export const getQualityControlsByLotId = async (
  req: Request,
  res: Response
) => {
  try {
    const { lotId } = req.params;

    const qualityControls = await prisma.qualityControl.findMany({
      where: { lotId },
      orderBy: { controlDate: "desc" },
    });

    return res.json(qualityControls);
  } catch (error) {
    console.error("Get quality controls by lot ID error:", error);
    return res
      .status(500)
      .json({
        message:
          "Erreur lors de la récupération des contrôles de qualité du lot",
      });
  }
};

// Créer un nouveau contrôle de qualité
export const createQualityControl = async (req: Request, res: Response) => {
  try {
    const {
      lotId,
      controlDate,
      germinationRate,
      varietyPurity,
      result,
      observations,
    } = req.body;

    if (
      !lotId ||
      !controlDate ||
      germinationRate === undefined ||
      varietyPurity === undefined ||
      !result
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs obligatoires doivent être fournis" });
    }

    // Vérifier si le lot existe
    const lot = await prisma.seedLot.findUnique({ where: { id: lotId } });
    if (!lot) {
      return res.status(400).json({ message: "Lot de semences non trouvé" });
    }

    // Créer le contrôle de qualité
    const newQualityControl = await prisma.qualityControl.create({
      data: {
        lotId,
        controlDate: new Date(controlDate),
        germinationRate: parseFloat(germinationRate),
        varietyPurity: parseFloat(varietyPurity),
        result: result as TestResult,
        observations,
      },
    });

    return res.status(201).json(newQualityControl);
  } catch (error) {
    console.error("Create quality control error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création du contrôle de qualité" });
  }
};

// Mettre à jour un contrôle de qualité
export const updateQualityControl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      lotId,
      controlDate,
      germinationRate,
      varietyPurity,
      result,
      observations,
    } = req.body;

    // Vérifier si le contrôle de qualité existe
    const existingQualityControl = await prisma.qualityControl.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingQualityControl) {
      return res
        .status(404)
        .json({ message: "Contrôle de qualité non trouvé" });
    }

    // Si le lot est modifié, vérifier s'il existe
    if (lotId && lotId !== existingQualityControl.lotId) {
      const lot = await prisma.seedLot.findUnique({ where: { id: lotId } });
      if (!lot) {
        return res.status(400).json({ message: "Lot de semences non trouvé" });
      }
    }

    // Mettre à jour le contrôle de qualité
    const updatedQualityControl = await prisma.qualityControl.update({
      where: { id: parseInt(id) },
      data: {
        lotId,
        controlDate: controlDate ? new Date(controlDate) : undefined,
        germinationRate:
          germinationRate !== undefined
            ? parseFloat(germinationRate)
            : undefined,
        varietyPurity:
          varietyPurity !== undefined ? parseFloat(varietyPurity) : undefined,
        result: result as TestResult,
        observations,
      },
    });

    return res.json(updatedQualityControl);
  } catch (error) {
    console.error("Update quality control error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour du contrôle de qualité",
      });
  }
};

// Supprimer un contrôle de qualité
export const deleteQualityControl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si le contrôle de qualité existe
    const existingQualityControl = await prisma.qualityControl.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingQualityControl) {
      return res
        .status(404)
        .json({ message: "Contrôle de qualité non trouvé" });
    }

    // Supprimer le contrôle de qualité
    await prisma.qualityControl.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: "Contrôle de qualité supprimé avec succès" });
  } catch (error) {
    console.error("Delete quality control error:", error);
    return res
      .status(500)
      .json({
        message: "Erreur lors de la suppression du contrôle de qualité",
      });
  }
};
