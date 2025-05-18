import { Request, Response } from "express";
import { prisma } from "../app";
import { ProductionStatus, ParcelStatus } from "@prisma/client";

// Obtenir toutes les productions
export const getAllProductions = async (req: Request, res: Response) => {
  try {
    const { status, parcelId, lotId } = req.query;

    const filters: any = {};

    if (status) {
      filters.status = status as ProductionStatus;
    }

    if (parcelId) {
      filters.parcelId = parseInt(parcelId as string);
    }

    if (lotId) {
      filters.lotId = lotId as string;
    }

    const productions = await prisma.production.findMany({
      where: filters,
      include: {
        lot: {
          include: {
            variety: true,
          },
        },
        parcel: true,
      },
      orderBy: {
        sowingDate: "desc",
      },
    });

    return res.json(productions);
  } catch (error) {
    console.error("Get all productions error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des productions" });
  }
};

// Obtenir une production par son ID
export const getProductionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const production = await prisma.production.findUnique({
      where: { id: parseInt(id) },
      include: {
        lot: {
          include: {
            variety: true,
          },
        },
        parcel: true,
      },
    });

    if (!production) {
      return res.status(404).json({ message: "Production non trouvée" });
    }

    return res.json(production);
  } catch (error) {
    console.error("Get production by ID error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la production" });
  }
};

// Créer une nouvelle production
export const createProduction = async (req: Request, res: Response) => {
  try {
    const {
      lotId,
      parcelId,
      sowingDate,
      harvestDate,
      yield: yieldValue,
      conditions,
      status,
    } = req.body;

    if (!lotId || !parcelId || !sowingDate) {
      return res
        .status(400)
        .json({
          message: "Le lot, la parcelle et la date de semis sont obligatoires",
        });
    }

    // Vérifier si le lot existe
    const lot = await prisma.seedLot.findUnique({
      where: { id: lotId },
    });

    if (!lot) {
      return res.status(400).json({ message: "Lot de semences non trouvé" });
    }

    // Vérifier si la parcelle existe
    const parcel = await prisma.parcel.findUnique({
      where: { id: parseInt(parcelId) },
    });

    if (!parcel) {
      return res.status(400).json({ message: "Parcelle non trouvée" });
    }

    // Vérifier si la parcelle est disponible
    if (parcel.status !== ParcelStatus.AVAILABLE) {
      return res
        .status(400)
        .json({ message: "La parcelle n'est pas disponible" });
    }

    // Transaction pour créer la production et mettre à jour le statut de la parcelle
    const result = await prisma.$transaction(async (prisma) => {
      // Créer la production
      const production = await prisma.production.create({
        data: {
          lotId,
          parcelId: parseInt(parcelId),
          sowingDate: new Date(sowingDate),
          harvestDate: harvestDate ? new Date(harvestDate) : null,
          yield: yieldValue ? parseFloat(yieldValue) : null,
          conditions,
          status: (status as ProductionStatus) || ProductionStatus.PLANNING,
        },
      });

      // Mettre à jour le statut de la parcelle
      await prisma.parcel.update({
        where: { id: parseInt(parcelId) },
        data: {
          status: ParcelStatus.IN_USE,
        },
      });

      return production;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create production error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de la production" });
  }
};

// Mettre à jour une production
export const updateProduction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      lotId,
      parcelId,
      sowingDate,
      harvestDate,
      yield: yieldValue,
      conditions,
      status,
    } = req.body;

    // Vérifier si la production existe
    const existingProduction = await prisma.production.findUnique({
      where: { id: parseInt(id) },
      include: {
        parcel: true,
      },
    });

    if (!existingProduction) {
      return res.status(404).json({ message: "Production non trouvée" });
    }

    // Vérifier si le lot existe en cas de modification
    if (lotId && lotId !== existingProduction.lotId) {
      const lot = await prisma.seedLot.findUnique({
        where: { id: lotId },
      });

      if (!lot) {
        return res.status(400).json({ message: "Lot de semences non trouvé" });
      }
    }

    // Vérifier si la parcelle existe en cas de modification
    let newParcel = null;
    if (parcelId && parseInt(parcelId) !== existingProduction.parcelId) {
      newParcel = await prisma.parcel.findUnique({
        where: { id: parseInt(parcelId) },
      });

      if (!newParcel) {
        return res.status(400).json({ message: "Parcelle non trouvée" });
      }

      // Vérifier si la nouvelle parcelle est disponible
      if (newParcel.status !== ParcelStatus.AVAILABLE) {
        return res
          .status(400)
          .json({ message: "La nouvelle parcelle n'est pas disponible" });
      }
    }

    // Vérifier si le statut change pour COMPLETED
    const isCompleted =
      status === ProductionStatus.COMPLETED &&
      existingProduction.status !== ProductionStatus.COMPLETED;

    // Transaction pour mettre à jour la production et gérer les statuts des parcelles
    const result = await prisma.$transaction(async (prisma) => {
      // Mettre à jour la production
      const updatedProduction = await prisma.production.update({
        where: { id: parseInt(id) },
        data: {
          lotId,
          parcelId: parcelId ? parseInt(parcelId) : undefined,
          sowingDate: sowingDate ? new Date(sowingDate) : undefined,
          harvestDate: harvestDate ? new Date(harvestDate) : undefined,
          yield: yieldValue ? parseFloat(yieldValue) : undefined,
          conditions,
          status: status as ProductionStatus,
        },
      });

      // Si la parcelle a changé, mettre à jour les statuts
      if (newParcel) {
        // Libérer l'ancienne parcelle
        await prisma.parcel.update({
          where: { id: existingProduction.parcelId },
          data: {
            status: ParcelStatus.AVAILABLE,
          },
        });

        // Occuper la nouvelle parcelle
        await prisma.parcel.update({
          where: { id: parseInt(parcelId) },
          data: {
            status: ParcelStatus.IN_USE,
          },
        });
      }
      // Si le statut passe à COMPLETED, mettre la parcelle en repos
      else if (isCompleted) {
        await prisma.parcel.update({
          where: { id: existingProduction.parcelId },
          data: {
            status: ParcelStatus.RESTING,
          },
        });
      }

      return updatedProduction;
    });

    return res.json(result);
  } catch (error) {
    console.error("Update production error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la production" });
  }
};

// Supprimer une production
export const deleteProduction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si la production existe
    const existingProduction = await prisma.production.findUnique({
      where: { id: parseInt(id) },
      include: {
        parcel: true,
      },
    });

    if (!existingProduction) {
      return res.status(404).json({ message: "Production non trouvée" });
    }

    // Transaction pour supprimer la production et libérer la parcelle
    const result = await prisma.$transaction(async (prisma) => {
      // Supprimer la production
      await prisma.production.delete({
        where: { id: parseInt(id) },
      });

      // Libérer la parcelle si elle était en cours d'utilisation
      if (existingProduction.parcel.status === ParcelStatus.IN_USE) {
        await prisma.parcel.update({
          where: { id: existingProduction.parcelId },
          data: {
            status: ParcelStatus.AVAILABLE,
          },
        });
      }
    });

    return res.json({ message: "Production supprimée avec succès" });
  } catch (error) {
    console.error("Delete production error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la production" });
  }
};

// Gérer la récolte
export const harvestProduction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { harvestDate, yield: yieldValue, observations } = req.body;

    if (!harvestDate || !yieldValue) {
      return res
        .status(400)
        .json({
          message: "La date de récolte et le rendement sont obligatoires",
        });
    }

    // Vérifier si la production existe
    const existingProduction = await prisma.production.findUnique({
      where: { id: parseInt(id) },
      include: {
        lot: true,
        parcel: true,
      },
    });

    if (!existingProduction) {
      return res.status(404).json({ message: "Production non trouvée" });
    }

    // Vérifier que le statut n'est pas déjà COMPLETED
    if (existingProduction.status === ProductionStatus.COMPLETED) {
      return res
        .status(400)
        .json({ message: "Cette production a déjà été récoltée" });
    }

    // Transaction pour mettre à jour la production, le lot et la parcelle
    const result = await prisma.$transaction(async (prisma) => {
      // Mettre à jour la production
      const updatedProduction = await prisma.production.update({
        where: { id: parseInt(id) },
        data: {
          harvestDate: new Date(harvestDate),
          yield: parseFloat(yieldValue),
          conditions: observations || existingProduction.conditions,
          status: ProductionStatus.COMPLETED,
        },
      });

      // Mettre à jour la quantité du lot
      await prisma.seedLot.update({
        where: { id: existingProduction.lotId },
        data: {
          quantity: {
            increment: parseFloat(yieldValue),
          },
        },
      });

      // Mettre la parcelle en repos
      await prisma.parcel.update({
        where: { id: existingProduction.parcelId },
        data: {
          status: ParcelStatus.RESTING,
        },
      });

      return updatedProduction;
    });

    return res.json(result);
  } catch (error) {
    console.error("Harvest production error:", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de l'enregistrement de la récolte" });
  }
};
