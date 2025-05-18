// backend/src/validation/qualityControl.validation.ts

import { TestResult } from "@prisma/client";

/**
 * Schémas de validation pour les contrôles de qualité
 */

// Schéma pour la création d'un contrôle de qualité
export const createQualityControlSchema = {
  lotId: {
    required: true,
    type: "string",
  },
  controlDate: {
    required: true,
    type: "date",
  },
  germinationRate: {
    required: true,
    type: "number",
    min: 0,
    max: 100,
  },
  varietyPurity: {
    required: true,
    type: "number",
    min: 0,
    max: 100,
  },
  result: {
    required: true,
    enum: Object.values(TestResult),
  },
  observations: {
    required: false,
    type: "string",
  },
};

// Schéma pour la mise à jour d'un contrôle de qualité
export const updateQualityControlSchema = {
  lotId: {
    required: false,
    type: "string",
  },
  controlDate: {
    required: false,
    type: "date",
  },
  germinationRate: {
    required: false,
    type: "number",
    min: 0,
    max: 100,
  },
  varietyPurity: {
    required: false,
    type: "number",
    min: 0,
    max: 100,
  },
  result: {
    required: false,
    enum: Object.values(TestResult),
  },
  observations: {
    required: false,
    type: "string",
  },
};

// Schéma pour le filtrage des contrôles de qualité
export const filterQualityControlSchema = {
  result: {
    required: false,
    enum: Object.values(TestResult),
  },
  fromDate: {
    required: false,
    type: "date",
  },
  toDate: {
    required: false,
    type: "date",
  },
};
