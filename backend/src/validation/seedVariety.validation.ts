// backend/src/validation/seedVariety.validation.ts

/**
 * Schémas de validation pour les variétés de semences
 */

// Schéma pour la création d'une variété
export const createSeedVarietySchema = {
  name: {
    required: true,
    type: "string",
    min: 2,
    max: 100,
  },
  description: {
    required: false,
    type: "string",
  },
  origin: {
    required: false,
    type: "string",
  },
  creationDate: {
    required: true,
    type: "date",
  },
};

// Schéma pour la mise à jour d'une variété
export const updateSeedVarietySchema = {
  name: {
    required: false,
    type: "string",
    min: 2,
    max: 100,
  },
  description: {
    required: false,
    type: "string",
  },
  origin: {
    required: false,
    type: "string",
  },
  creationDate: {
    required: false,
    type: "date",
  },
};

// Schéma pour la recherche de variétés
export const searchSeedVarietySchema = {
  search: {
    required: false,
    type: "string",
  },
};
