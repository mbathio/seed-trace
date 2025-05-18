// backend/src/utils/validators.ts

/**
 * Utilitaire pour validation des données
 */
export class Validators {
  /**
   * Valider une adresse email
   * @param email Email à valider
   * @returns true si l'email est valide
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Valider un mot de passe (min 8 caractères, une majuscule, une minuscule, un chiffre)
   * @param password Mot de passe à valider
   * @returns true si le mot de passe est valide
   */
  static isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Valider un numéro de téléphone (format international)
   * @param phone Numéro de téléphone à valider
   * @returns true si le numéro est valide
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(?:\+[0-9]{1,3})?[0-9]{6,14}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Valider des coordonnées GPS
   * @param latitude Latitude
   * @param longitude Longitude
   * @returns true si les coordonnées sont valides
   */
  static isValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  }

  /**
   * Valider un code SeedLot (format XX-NIVEAU-ANNÉE-SEQ)
   * @param code Code à valider
   * @returns true si le code est valide
   */
  static isValidSeedLotCode(code: string): boolean {
    const seedLotRegex = /^[A-Z]{2}-[A-Z0-9]{2,3}-\d{4}-\d{3}$/;
    return seedLotRegex.test(code);
  }

  /**
   * Valider un numéro d'identification de parcelle (format P001)
   * @param code Code à valider
   * @returns true si le code est valide
   */
  static isValidParcelCode(code: string): boolean {
    const parcelCodeRegex = /^P\d{3}$/;
    return parcelCodeRegex.test(code);
  }

  /**
   * Valider un nombre positif
   * @param value Valeur à valider
   * @returns true si la valeur est un nombre positif
   */
  static isPositiveNumber(value: any): boolean {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }

  /**
   * Valider un pourcentage (0-100)
   * @param value Valeur à valider
   * @returns true si la valeur est un pourcentage valide
   */
  static isValidPercentage(value: any): boolean {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 100;
  }

  /**
   * Valider une chaîne non vide
   * @param value Valeur à valider
   * @returns true si la chaîne n'est pas vide
   */
  static isNonEmptyString(value: any): boolean {
    return typeof value === "string" && value.trim().length > 0;
  }

  /**
   * Valider une surface en hectares (min 0.01, max 1000)
   * @param value Surface à valider
   * @returns true si la surface est valide
   */
  static isValidArea(value: any): boolean {
    const num = Number(value);
    return !isNaN(num) && num >= 0.01 && num <= 1000;
  }
}

export default Validators;
