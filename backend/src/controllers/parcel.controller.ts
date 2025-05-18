import { Request, Response } from "express";
import { prisma } from "../app";
import { ParcelStatus } from "@prisma/client";

// Obtenir toutes les parcelles
export const getAllParcels = async (req: Request, res: Response) => {
  try {
    const { status, soilType } = req.query;

    const filters: any = {};

    if (status) {
      filters.status = status as ParcelStatus;
    }

    if (soilType) {
      filters.soilType = { contains: soilType as string, mode: "insensitive" };
    }

    const parcels = await prisma.parcel.findMany({
      where: filters,
      include: {
        productions: {
          include: {
            lot: {
              include: {
                variety: true,
              },
            },
          },
        },
      },
    });

    return res.json(parcels);
  } catch (error) {
    console.error("Get all parcels error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des parcelles" });
  }
};

// Obtenir une parcelle par son ID
export const getParcelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parcel = await prisma.parcel.findUnique({
      where: { id: parseInt(id) },
      include: {
        productions: {
          include: {
            lot: {
              include: {
                variety: true,
              },
            },
          },
          orderBy: {
            sowingDate: "desc",
          },
        },
      },
    });

    if (!parcel) {
      return res.status(404).json({ message: "Parcelle non trouvée" });
    }

    return res.json(parcel);
  } catch (error) {
    console.error("Get parcel by ID error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la parcelle" });
  }
};

// Créer une nouvelle parcelle
export const createParcel = async (req: Request, res: Response) => {
  try {
    const { code, latitude, longitude, area, soilType, status } = req.body;

    if (!latitude || !longitude || !area) {
      return res
        .status(400)
        .json({
          message: "Les coordonnées et la superficie sont obligatoires",
        });
    }

    // Créer la parcelle
    const newParcel = await prisma.parcel.create({
      data: {
        code,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        area: parseFloat(area),
        soilType,
        status: (status as ParcelStatus) || ParcelStatus.AVAILABLE,
      },
    });

    return res.status(201).json(newParcel);
  } catch (error) {
    console.error("Create parcel error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de la parcelle" });
  }
};

// Mettre à jour une parcelle
export const updateParcel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, latitude, longitude, area, soilType, status } = req.body;

    // Vérifier si la parcelle existe
    const existingParcel = await prisma.parcel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingParcel) {
      return res.status(404).json({ message: "Parcelle non trouvée" });
    }

    // Mettre à jour la parcelle
    const updatedParcel = await prisma.parcel.update({
      where: { id: parseInt(id) },
      data: {
        code,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        area: area ? parseFloat(area) : undefined,
        soilType,
        status: status as ParcelStatus,
      },
    });

    return res.json(updatedParcel);
  } catch (error) {
    console.error("Update parcel error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la parcelle" });
  }
};

// Supprimer une parcelle
export const deleteParcel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si la parcelle existe
    const existingParcel = await prisma.parcel.findUnique({
      where: { id: parseInt(id) },
      include: {
        productions: true,
      },
    });

    if (!existingParcel) {
      return res.status(404).json({ message: "Parcelle non trouvée" });
    }

    // Vérifier si la parcelle a des productions associées
    if (existingParcel.productions.length > 0) {
      return res.status(400).json({
        message:
          "Impossible de supprimer cette parcelle car elle est associée à des productions",
        productions: existingParcel.productions,
      });
    }

    // Supprimer la parcelle
    await prisma.parcel.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: "Parcelle supprimée avec succès" });
  } catch (error) {
    console.error("Delete parcel error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la parcelle" });
  }
};
