// backend/src/validation/parcel.validation.ts

import { ParcelStatus } from "@prisma/client";

/**
 * Schémas de validation pour les parcelles
 */

// Schéma pour la création d'une parcelle
export const createParcelSchema = {
  code: {
    required: false,
    type: "string",
  },
  latitude: {
    required: true,
    type: "number",
    min: -90,
    max: 90,
    custom: (value: number) => {
      // Vérifier si la valeur est un nombre avec au maximum 6 décimales
      if (value.toString().split(".")[1]?.length > 6) {
        return "La latitude doit avoir au maximum 6 décimales";
      }
      return true;
    },
  },
  longitude: {
    required: true,
    type: "number",
    min: -180,
    max: 180,
    custom: (value: number) => {
      // Vérifier si la valeur est un nombre avec au maximum 6 décimales
      if (value.toString().split(".")[1]?.length > 6) {
        return "La longitude doit avoir au maximum 6 décimales";
      }
      return true;
    },
  },
  area: {
    required: true,
    type: "number",
    min: 0.01,
  },
  soilType: {
    required: false,
    type: "string",
  },
  status: {
    required: false,
    enum: Object.values(ParcelStatus),
  },
};

// Schéma pour la mise à jour d'une parcelle
export const updateParcelSchema = {
  code: {
    required: false,
    type: "string",
  },
  latitude: {
    required: false,
    type: "number",
    min: -90,
    max: 90,
    custom: (value: number) => {
      // Vérifier si la valeur est un nombre avec au maximum 6 décimales
      if (value.toString().split(".")[1]?.length > 6) {
        return "La latitude doit avoir au maximum 6 décimales";
      }
      return true;
    },
  },
  longitude: {
    required: false,
    type: "number",
    min: -180,
    max: 180,
    custom: (value: number) => {
      // Vérifier si la valeur est un nombre avec au maximum 6 décimales
      if (value.toString().split(".")[1]?.length > 6) {
        return "La longitude doit avoir au maximum 6 décimales";
      }
      return true;
    },
  },
  area: {
    required: false,
    type: "number",
    min: 0.01,
  },
  soilType: {
    required: false,
    type: "string",
  },
  status: {
    required: false,
    enum: Object.values(ParcelStatus),
  },
};

// Schéma pour le filtrage des parcelles
export const filterParcelSchema = {
  status: {
    required: false,
    enum: Object.values(ParcelStatus),
  },
  soilType: {
    required: false,
    type: "string",
  },
};
