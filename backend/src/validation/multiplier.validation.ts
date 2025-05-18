// backend/src/validation/multiplier.validation.ts

import { MultiplierStatus } from "@prisma/client";

/**
 * Schémas de validation pour les multiplicateurs
 */

// Schéma pour la création d'un multiplicateur
export const createMultiplierSchema = {
  name: {
    required: true,
    type: "string" as "string",
    min: 2,
    max: 100,
  },
  address: {
    required: true,
    type: "string" as "string",
    min: 5,
  },
  phone: {
    required: false,
    type: "string" as "string",
    pattern: /^(?:\+[0-9]{1,3})?[0-9]{6,14}$/,
  },
  email: {
    required: false,
    type: "string" as "string",
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  status: {
    required: false,
    enum: Object.values(MultiplierStatus),
  },
};

// Schéma pour la mise à jour d'un multiplicateur
export const updateMultiplierSchema = {
  name: {
    required: false,
    type: "string" as "string",
    min: 2,
    max: 100,
  },
  address: {
    required: false,
    type: "string" as "string",
    min: 5,
  },
  phone: {
    required: false,
    type: "string" as "string",
    pattern: /^(?:\+[0-9]{1,3})?[0-9]{6,14}$/,
  },
  email: {
    required: false,
    type: "string" as "string",
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  status: {
    required: false,
    enum: Object.values(MultiplierStatus),
  },
};

// Schéma pour la distribution de lots
export const distributeLotSchema = {
  lotId: {
    required: true,
    type: "string" as "string",
  },
  quantity: {
    required: true,
    type: "number" as "number",
    min: 0.1,
  },
  distributionDate: {
    required: true,
    type: "date" as "date",
  },
};

// Schéma pour le filtrage des multiplicateurs
export const filterMultiplierSchema = {
  status: {
    required: false,
    enum: Object.values(MultiplierStatus),
  },
  search: {
    required: false,
    type: "string" as "string",
  },
};
