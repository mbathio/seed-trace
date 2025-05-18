// backend/src/utils/qrUtils.ts

/**
 * Utilitaires pour travailler avec les codes QR
 */

/**
 * Convertit une Data URL en Buffer
 * @param dataUrl Data URL à convertir
 * @returns Buffer contenant les données de l'image
 */
export const dataUrlToBuffer = (dataUrl: string): Buffer => {
  // Extraire la partie base64 de la data URL
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  // Convertir en Buffer
  return Buffer.from(base64Data, "base64");
};

/**
 * Convertit un Buffer en Data URL
 * @param buffer Buffer à convertir
 * @param mimeType Type MIME de l'image (par défaut: image/png)
 * @returns Data URL
 */
export const bufferToDataUrl = (
  buffer: Buffer,
  mimeType: string = "image/png"
): string => {
  // Convertir en base64
  const base64Data = buffer.toString("base64");
  // Créer la data URL
  return `data:${mimeType};base64,${base64Data}`;
};

/**
 * Génère un nom de fichier unique pour un code QR
 * @param entity Type d'entité (seedLot, qualityControl, etc.)
 * @param id ID de l'entité
 * @returns Nom de fichier unique
 */
export const generateQRFilename = (
  entity: string,
  id: string | number
): string => {
  const timestamp = Date.now();
  const sanitizedId = id.toString().replace(/[^a-zA-Z0-9]/g, "_");
  return `qr_${entity}_${sanitizedId}_${timestamp}.png`;
};

/**
 * Valide si une chaîne est une Data URL d'image valide
 * @param dataUrl Chaîne à valider
 * @returns true si c'est une Data URL valide, false sinon
 */
export const isValidImageDataUrl = (dataUrl: string): boolean => {
  // Vérifier que c'est une data URL d'image
  return /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(dataUrl);
};

/**
 * Redimensionne une taille d'image si elle dépasse les limites
 * @param width Largeur originale
 * @param height Hauteur originale
 * @param maxWidth Largeur maximale
 * @param maxHeight Hauteur maximale
 * @returns Nouvelles dimensions
 */
export const resizeQRDimensions = (
  width: number,
  height: number,
  maxWidth: number = 1000,
  maxHeight: number = 1000
): { width: number; height: number } => {
  // Si les dimensions sont inférieures aux maximums, retourner les originales
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // Calculer le ratio
  const ratio = Math.min(maxWidth / width, maxHeight / height);

  // Retourner les dimensions redimensionnées
  return {
    width: Math.floor(width * ratio),
    height: Math.floor(height * ratio),
  };
};
