// backend/src/validation/production.validation.ts

import { ProductionStatus } from "@prisma/client";

/**
 * Schémas de validation pour les productions
 */

// Schéma pour la création d'une production
export const createProductionSchema = {
  lotId: {
    required: true,
    type: "string",
  },
  parcelId: {
    required: true,
    type: "number",
    min: 1,
  },
  sowingDate: {
    required: true,
    type: "date",
  },
  harvestDate: {
    required: false,
    type: "date",
  },
  yield: {
    required: false,
    type: "number",
    min: 0,
  },
  conditions: {
    required: false,
    type: "string",
  },
  status: {
    required: false,
    enum: Object.values(ProductionStatus),
  },
};

// Schéma pour la mise à jour d'une production
export const updateProductionSchema = {
  lotId: {
    required: false,
    type: "string",
  },
  parcelId: {
    required: false,
    type: "number",
    min: 1,
  },
  sowingDate: {
    required: false,
    type: "date",
  },
  harvestDate: {
    required: false,
    type: "date",
  },
  yield: {
    required: false,
    type: "number",
    min: 0,
  },
  conditions: {
    required: false,
    type: "string",
  },
  status: {
    required: false,
    enum: Object.values(ProductionStatus),
  },
};

// Schéma pour l'enregistrement d'une récolte
export const harvestProductionSchema = {
  harvestDate: {
    required: true,
    type: "date",
  },
  yield: {
    required: true,
    type: "number",
    min: 0,
  },
  observations: {
    required: false,
    type: "string",
  },
};
