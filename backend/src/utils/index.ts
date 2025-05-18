// backend/src/utils/index.ts (Mise à jour avec QR utils)

export * from "./dateUtils";
export * from "./validators";
export * from "./idGenerator";
export * from "./qrUtils"; // Nouvelle exportation pour les utilitaires QR

/**
 * Génère une chaîne aléatoire
 * @param length Longueur de la chaîne (défaut: 10)
 * @returns Chaîne aléatoire
 */
export const generateRandomString = (length: number = 10): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Nettoie un objet en supprimant les propriétés undefined
 * @param obj Objet à nettoyer
 * @returns Objet nettoyé
 */
export const cleanObject = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param num Nombre à formater
 * @param decimals Nombre de décimales (défaut: 2)
 * @param decimalSeparator Séparateur décimal (défaut: ,)
 * @param thousandsSeparator Séparateur de milliers (défaut: espace)
 * @returns Nombre formaté
 */
export const formatNumber = (
  num: number,
  decimals: number = 2,
  decimalSeparator: string = ",",
  thousandsSeparator: string = " "
): string => {
  if (isNaN(num)) return "0";

  const fixed = num.toFixed(decimals);
  const [wholePart, decimalPart] = fixed.split(".");

  const formattedWholePart = wholePart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator
  );

  return decimals > 0
    ? `${formattedWholePart}${decimalSeparator}${decimalPart}`
    : formattedWholePart;
};

/**
 * Tronque une chaîne si elle dépasse une certaine longueur
 * @param str Chaîne à tronquer
 * @param maxLength Longueur maximum (défaut: 100)
 * @param suffix Suffixe à ajouter si tronqué (défaut: ...)
 * @returns Chaîne tronquée
 */
export const truncateString = (
  str: string,
  maxLength: number = 100,
  suffix: string = "..."
): string => {
  if (!str) return "";

  if (str.length <= maxLength) return str;

  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Filtre les données de pagination des paramètres de requête
 * @param queryParams Paramètres de requête
 * @returns Paramètres filtrés (sans pagination)
 */
export const filterPaginationParams = (
  queryParams: Record<string, any>
): Record<string, any> => {
  const { page, limit, ...filteredParams } = queryParams;
  return filteredParams;
};
