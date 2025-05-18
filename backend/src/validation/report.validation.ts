// backend/src/validation/report.validation.ts

/**
 * Schémas de validation pour les rapports
 */

// Schéma pour les statistiques de production
export const productionStatsSchema = {
  period: {
    required: false,
    enum: ["3months", "6months", "1year", "all"],
  },
  varietyId: {
    required: false,
    type: "number",
    min: 1,
  },
};

// Schéma pour les statistiques de qualité
export const qualityStatsSchema = {
  // Pas de paramètres spécifiques pour l'instant
};

// Schéma pour les statistiques régionales
export const regionalStatsSchema = {
  // Pas de paramètres spécifiques pour l'instant
};

// Schéma pour le rapport de lot
export const lotReportSchema = {
  id: {
    required: true,
    type: "string",
  },
};

// Schéma pour le rapport de variété
export const varietyReportSchema = {
  id: {
    required: true,
    type: "number",
    min: 1,
  },
};
