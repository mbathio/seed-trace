// backend/src/validation/qr.validation.ts

/**
 * Schémas de validation pour les opérations avec les codes QR
 */

// Schéma pour le décodage d'un QR code via data URL
export const decodeQRDataURLSchema = {
  dataUrl: {
    required: true,
    type: "string",
    custom: (value: string) => {
      if (!value.startsWith("data:image/")) {
        return "Format d'image invalide. Doit être une data URL d'image";
      }
      return true;
    },
  },
};

// Schéma pour la vérification de code QR
export const verifyQRSchema = {
  data: {
    required: true,
    type: "object",
  },
  "data.type": {
    required: true,
    type: "string",
    enum: ["seedLot", "qualityControl", "parcel", "distribution"],
  },
};

// Schéma pour la sauvegarde de code QR
export const saveQRSchema = {
  type: {
    required: true,
    type: "string",
    enum: ["seedLot", "qualityControl", "parcel", "distribution"],
  },
  id: {
    required: true,
    type: "string",
  },
};

// Schéma pour la génération de QR code
export const generateQRSchema = {
  id: {
    required: true,
    type: "string",
  },
};
