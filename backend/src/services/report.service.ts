import { Parcel, ParcelStatus } from "@prisma/client";
import { prisma } from "../app";

interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface ParcelData {
  code?: string;
  latitude: number;
  longitude: number;
  area: number;
  soilType?: string;
  status?: ParcelStatus;
}

/**
 * Service pour la gestion des parcelles agricoles
 */
export class ParcelService {
  /**
   * Calcule la distance en kilomètres entre deux points géographiques
   * @param point1 Premier point géographique
   * @param point2 Second point géographique
   * @returns Distance en kilomètres
   */
  static calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) *
        Math.cos(this.toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 1000) / 1000; // Arrondir à 3 décimales
  }

  /**
   * Convertit les degrés en radians
   * @param degrees Angle en degrés
   * @returns Angle en radians
   */
  private static toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Trouve les parcelles disponibles dans un rayon donné
   * @param centerPoint Point central
   * @param radiusKm Rayon en kilomètres
   * @returns Liste des parcelles disponibles dans ce rayon
   */
  static async findAvailableWithinRadius(
    centerPoint: GeoPoint,
    radiusKm: number
  ): Promise<Parcel[]> {
    // Récupérer toutes les parcelles disponibles
    const availableParcels = await prisma.parcel.findMany({
      where: {
        status: ParcelStatus.AVAILABLE,
      },
    });

    // Filtrer les parcelles dans le rayon spécifié
    return availableParcels.filter(
      (parcel) =>
        this.calculateDistance(centerPoint, {
          latitude: parcel.latitude,
          longitude: parcel.longitude,
        }) <= radiusKm
    );
  }

  /**
   * Vérifie s'il existe un chevauchement entre les parcelles
   * @param newParcel Données de la nouvelle parcelle
   * @param toleranceKm Tolérance en kilomètres
   * @returns true s'il y a chevauchement, false sinon
   */
  static async checkOverlap(
    newParcel: ParcelData,
    toleranceKm: number = 0.05
  ): Promise<boolean> {
    // Récupérer toutes les parcelles existantes
    const existingParcels = await prisma.parcel.findMany();

    // Vérifier les chevauchements avec une tolérance
    for (const parcel of existingParcels) {
      const distance = this.calculateDistance(
        { latitude: newParcel.latitude, longitude: newParcel.longitude },
        { latitude: parcel.latitude, longitude: parcel.longitude }
      );

      // Si les parcelles sont trop proches, considérer qu'il y a chevauchement
      if (distance < toleranceKm) {
        return true;
      }
    }

    return false;
  }

  /**
   * Génère un code unique pour une parcelle
   * @returns Code unique pour une parcelle
   */
  static async generateUniqueCode(): Promise<string> {
    const prefix = "P";
    let counter = 1;
    let code = `${prefix}${counter.toString().padStart(3, "0")}`;

    // Vérifier si le code existe déjà
    let codeExists = await prisma.parcel.findFirst({
      where: { code },
    });

    // Incrémenter le compteur jusqu'à trouver un code unique
    while (codeExists) {
      counter++;
      code = `${prefix}${counter.toString().padStart(3, "0")}`;
      codeExists = await prisma.parcel.findFirst({
        where: { code },
      });
    }

    return code;
  }

  /**
   * Marque une parcelle comme en repos et définit un rappel pour la rendre disponible ultérieurement
   * @param parcelId ID de la parcelle
   * @param restingMonths Durée de repos en mois
   */
  static async setParcelResting(
    parcelId: number,
    restingMonths: number = 3
  ): Promise<Parcel> {
    // Mettre la parcelle en repos
    const updatedParcel = await prisma.parcel.update({
      where: { id: parcelId },
      data: {
        status: ParcelStatus.RESTING,
      },
    });

    // Dans une application réelle, on pourrait ici créer une tâche planifiée
    // pour rendre la parcelle disponible après la période de repos
    // Par exemple avec un job scheduler comme node-cron

    // Simuler la création d'une tâche planifiée en logguant l'information
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + restingMonths);
    console.log(
      `[SCHEDULED] Parcelle ${parcelId} sera disponible le ${futureDate.toISOString()}`
    );

    return updatedParcel;
  }

  /**
   * Calcule la superficie totale de toutes les parcelles ou d'un sous-ensemble
   * @param status Filtre optionnel sur le statut des parcelles
   * @returns Superficie totale en hectares
   */
  static async calculateTotalArea(status?: ParcelStatus): Promise<number> {
    const filter = status ? { status } : {};

    const parcels = await prisma.parcel.findMany({
      where: filter,
      select: { area: true },
    });

    return parcels.reduce((sum, parcel) => sum + parcel.area, 0);
  }
}

export default ParcelService;
