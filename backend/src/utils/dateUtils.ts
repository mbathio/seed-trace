// backend/src/utils/dateUtils.ts

/**
 * Utilitaire pour manipuler les dates
 */
export class DateUtils {
  /**
   * Formater une date en chaîne lisible
   * @param date Date à formater
   * @param format Format de sortie (simple, full, iso, etc.)
   * @returns Chaîne formatée
   */
  static formatDate(
    date: Date,
    format: "simple" | "full" | "iso" = "simple"
  ): string {
    if (!date) return "";

    const d = new Date(date);

    switch (format) {
      case "simple":
        return d.toLocaleDateString("fr-FR");
      case "full":
        return d.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "iso":
        return d.toISOString();
      default:
        return d.toLocaleDateString("fr-FR");
    }
  }

  /**
   * Vérifier si une date est antérieure à une autre
   * @param date1 Première date
   * @param date2 Deuxième date
   * @returns true si date1 < date2
   */
  static isBefore(date1: Date, date2: Date): boolean {
    return new Date(date1).getTime() < new Date(date2).getTime();
  }

  /**
   * Vérifier si une date est postérieure à une autre
   * @param date1 Première date
   * @param date2 Deuxième date
   * @returns true si date1 > date2
   */
  static isAfter(date1: Date, date2: Date): boolean {
    return new Date(date1).getTime() > new Date(date2).getTime();
  }

  /**
   * Calculer la différence en jours entre deux dates
   * @param date1 Première date
   * @param date2 Deuxième date
   * @returns Nombre de jours de différence
   */
  static daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // 24h en millisecondes
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Normaliser les dates (retirer l'heure)
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
  }

  /**
   * Ajouter des jours à une date
   * @param date Date de départ
   * @param days Nombre de jours à ajouter
   * @returns Nouvelle date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Ajouter des mois à une date
   * @param date Date de départ
   * @param months Nombre de mois à ajouter
   * @returns Nouvelle date
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Vérifier si une date est valide
   * @param date Date à vérifier
   * @returns true si la date est valide
   */
  static isValidDate(date: any): boolean {
    if (!date) return false;

    const d = new Date(date);
    return !isNaN(d.getTime());
  }

  /**
   * Obtenir le début d'une période
   * @param period Période (day, week, month, year)
   * @param date Date de référence (défaut: aujourd'hui)
   * @returns Date du début de la période
   */
  static startOfPeriod(
    period: "day" | "week" | "month" | "year",
    date?: Date
  ): Date {
    const d = date ? new Date(date) : new Date();

    switch (period) {
      case "day":
        d.setHours(0, 0, 0, 0);
        break;
      case "week":
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuster si dimanche
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        break;
      case "month":
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        break;
      case "year":
        d.setMonth(0, 1);
        d.setHours(0, 0, 0, 0);
        break;
    }

    return d;
  }

  /**
   * Obtenir la fin d'une période
   * @param period Période (day, week, month, year)
   * @param date Date de référence (défaut: aujourd'hui)
   * @returns Date de fin de la période
   */
  static endOfPeriod(
    period: "day" | "week" | "month" | "year",
    date?: Date
  ): Date {
    const d = date ? new Date(date) : new Date();

    switch (period) {
      case "day":
        d.setHours(23, 59, 59, 999);
        break;
      case "week":
        const day = d.getDay();
        const diff = d.getDate() + (day === 0 ? 0 : 7 - day);
        d.setDate(diff);
        d.setHours(23, 59, 59, 999);
        break;
      case "month":
        d.setMonth(d.getMonth() + 1, 0); // Dernier jour du mois
        d.setHours(23, 59, 59, 999);
        break;
      case "year":
        d.setMonth(11, 31); // 31 décembre
        d.setHours(23, 59, 59, 999);
        break;
    }

    return d;
  }
}

export default DateUtils;
