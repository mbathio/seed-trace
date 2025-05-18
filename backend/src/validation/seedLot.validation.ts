// backend/src/validation/seedLot.validation.ts

import { SeedLevel, LotStatus } from "@prisma/client";

/**
 * Schémas de validation pour les lots de semences
 */

// Schéma pour la création d'un lot
export const createSeedLotSchema = {
  id: {
    required: true,
    type: "string",
    custom: (value: string) => {
      if (!value.match(/^[A-Z]{2}-[A-Z0-9]{2,3}-\d{4}-\d{3}$/)) {
        return "Le format de l'identifiant est invalide (ex: SA-GO-2023-001)";
      }
      return true;
    },
  },
  varietyId: {
    required: true,
    type: "number",
    min: 1,
  },
  parentLotId: {
    required: false,
    type: "string",
  },
  level: {
    required: true,
    enum: Object.values(SeedLevel),
  },
  quantity: {
    required: true,
    type: "number",
    min: 0,
  },
  productionDate: {
    required: true,
    type: "date",
  },
  status: {
    required: false,
    enum: Object.values(LotStatus),
  },
};

// Schéma pour la mise à jour d'un lot
export const updateSeedLotSchema = {
  varietyId: {
    required: false,
    type: "number",
    min: 1,
  },
  parentLotId: {
    required: false,
    type: "string",
  },
  level: {
    required: false,
    enum: Object.values(SeedLevel),
  },
  quantity: {
    required: false,
    type: "number",
    min: 0,
  },
  productionDate: {
    required: false,
    type: "date",
  },
  status: {
    required: false,
    enum: Object.values(LotStatus),
  },
};

// Schéma pour la recherche de lots
export const searchSeedLotSchema = {
  level: {
    required: false,
    enum: Object.values(SeedLevel),
  },
  status: {
    required: false,
    enum: Object.values(LotStatus),
  },
  varietyId: {
    required: false,
    type: "number",
  },
  search: {
    required: false,
    type: "string",
  },
};
