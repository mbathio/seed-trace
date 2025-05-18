// backend/src/services/export.service.ts

import {
  SeedLot,
  SeedVariety,
  QualityControl,
  Multiplier,
  Parcel,
} from "@prisma/client";
import { prisma } from "../config/database";
import Logger from "./logging.service";
import { AuditService, AuditAction, AuditEntity } from "./audit.service";

/**
 * Formats d'export supportés
 */
export enum ExportFormat {
  CSV = "csv",
  JSON = "json",
  PDF = "pdf",
  EXCEL = "excel",
}

/**
 * Service pour l'export de données
 */
export class ExportService {
  /**
   * Exporter des lots de semences
   * @param format Format d'export (csv, json, excel, pdf)
   * @param filters Filtres pour sélectionner les lots
   * @param userId ID de l'utilisateur effectuant l'export
   * @returns Données exportées au format demandé
   */
  static async exportSeedLots(
    format: ExportFormat,
    filters: any = {},
    userId?: number
  ): Promise<string> {
    try {
      // Récupérer les lots avec leurs relations
      const seedLots = await prisma.seedLot.findMany({
        where: filters,
        include: {
          variety: true,
          parentLot: {
            select: {
              id: true,
              level: true,
            },
          },
          qualityControls: {
            orderBy: { controlDate: "desc" },
            take: 1,
          },
        },
        orderBy: { productionDate: "desc" },
      });

      // Préparer les données pour l'export
      const exportData = seedLots.map((lot) => ({
        id: lot.id,
        variety: lot.variety.name,
        level: lot.level,
        parentLot: lot.parentLot?.id || "Aucun",
        quantity: lot.quantity,
        productionDate: lot.productionDate.toISOString().split("T")[0],
        status: lot.status,
        latestQualityControl:
          lot.qualityControls.length > 0
            ? {
                date: lot.qualityControls[0].controlDate
                  .toISOString()
                  .split("T")[0],
                germinationRate: lot.qualityControls[0].germinationRate,
                varietyPurity: lot.qualityControls[0].varietyPurity,
                result: lot.qualityControls[0].result,
              }
            : null,
      }));

      // Formater selon le format demandé
      let result: string;

      switch (format) {
        case ExportFormat.CSV:
          result = this.formatAsCSV(exportData);
          break;
        case ExportFormat.JSON:
          result = JSON.stringify(exportData, null, 2);
          break;
        case ExportFormat.EXCEL:
        case ExportFormat.PDF:
          // Pour ces formats, nous aurions besoin de librairies externes
          // Ici, on renvoie juste un message d'erreur
          throw new Error(`Format d'export ${format} non supporté`);
        default:
          throw new Error(`Format d'export inconnu: ${format}`);
      }

      // Enregistrer l'audit d'export
      if (userId) {
        await AuditService.createAudit({
          userId,
          action: AuditAction.EXPORT,
          entity: AuditEntity.SEED_LOT,
          entityId: "bulk",
          details: {
            format,
            recordCount: exportData.length,
            filters,
          },
        });
      }

      // Logger l'export
      Logger.info(
        `Exported ${exportData.length} seed lots in ${format} format`,
        "ExportService",
        {
          format,
          recordCount: exportData.length,
          filters,
        },
        userId
      );

      return result;
    } catch (error) {
      Logger.error(
        `Error exporting seed lots: ${error.message}`,
        "ExportService",
        { error, format, filters },
        userId
      );
      throw error;
    }
  }

  /**
   * Exporter des variétés de semences
   * @param format Format d'export (csv, json, excel, pdf)
   * @param filters Filtres pour sélectionner les variétés
   * @param userId ID de l'utilisateur effectuant l'export
   * @returns Données exportées au format demandé
   */
  static async exportSeedVarieties(
    format: ExportFormat,
    filters: any = {},
    userId?: number
  ): Promise<string> {
    try {
      // Récupérer les variétés
      const seedVarieties = await prisma.seedVariety.findMany({
        where: filters,
        include: {
          _count: {
            select: {
              lots: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });

      // Préparer les données pour l'export
      const exportData = seedVarieties.map((variety) => ({
        id: variety.id,
        name: variety.name,
        description: variety.description || "",
        origin: variety.origin || "",
        creationDate: variety.creationDate.toISOString().split("T")[0],
        lotCount: variety._count.lots,
      }));

      // Formater selon le format demandé
      let result: string;

      switch (format) {
        case ExportFormat.CSV:
          result = this.formatAsCSV(exportData);
          break;
        case ExportFormat.JSON:
          result = JSON.stringify(exportData, null, 2);
          break;
        case ExportFormat.EXCEL:
        case ExportFormat.PDF:
          throw new Error(`Format d'export ${format} non supporté`);
        default:
          throw new Error(`Format d'export inconnu: ${format}`);
      }

      // Enregistrer l'audit d'export
      if (userId) {
        await AuditService.createAudit({
          userId,
          action: AuditAction.EXPORT,
          entity: AuditEntity.SEED_VARIETY,
          entityId: "bulk",
          details: {
            format,
            recordCount: exportData.length,
            filters,
          },
        });
      }

      return result;
    } catch (error) {
      Logger.error(
        `Error exporting seed varieties: ${error.message}`,
        "ExportService",
        { error, format, filters },
        userId
      );
      throw error;
    }
  }

  /**
   * Exporter des contrôles de qualité
   * @param format Format d'export (csv, json, excel, pdf)
   * @param filters Filtres pour sélectionner les contrôles
   * @param userId ID de l'utilisateur effectuant l'export
   * @returns Données exportées au format demandé
   */
  static async exportQualityControls(
    format: ExportFormat,
    filters: any = {},
    userId?: number
  ): Promise<string> {
    // Implémentation similaire aux méthodes précédentes
    try {
      const qualityControls = await prisma.qualityControl.findMany({
        where: filters,
        include: {
          lot: {
            include: {
              variety: true,
            },
          },
        },
        orderBy: { controlDate: "desc" },
      });

      const exportData = qualityControls.map((control) => ({
        id: control.id,
        lotId: control.lotId,
        variety: control.lot.variety.name,
        level: control.lot.level,
        controlDate: control.controlDate.toISOString().split("T")[0],
        germinationRate: control.germinationRate,
        varietyPurity: control.varietyPurity,
        result: control.result,
        observations: control.observations || "",
      }));

      let result: string;

      switch (format) {
        case ExportFormat.CSV:
          result = this.formatAsCSV(exportData);
          break;
        case ExportFormat.JSON:
          result = JSON.stringify(exportData, null, 2);
          break;
        default:
          throw new Error(`Format d'export inconnu ou non supporté: ${format}`);
      }

      // Audit
      if (userId) {
        await AuditService.createAudit({
          userId,
          action: AuditAction.EXPORT,
          entity: AuditEntity.QUALITY_CONTROL,
          entityId: "bulk",
          details: {
            format,
            recordCount: exportData.length,
            filters,
          },
        });
      }

      return result;
    } catch (error) {
      Logger.error(
        `Error exporting quality controls: ${error.message}`,
        "ExportService",
        { error, format, filters },
        userId
      );
      throw error;
    }
  }

  /**
   * Formater des données en CSV
   * @param data Données à formater
   * @returns Chaîne CSV
   */
  private static formatAsCSV(data: any[]): string {
    if (!data || data.length === 0) {
      return "";
    }

    // Extraire les en-têtes (clés du premier objet)
    const headers = Object.keys(data[0]);

    // Créer la ligne d'en-tête
    let csv = headers.map((header) => `"${header}"`).join(",") + "\n";

    // Ajouter les lignes de données
    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];

        // Formater selon le type
        if (value === null || value === undefined) {
          return "";
        } else if (typeof value === "object") {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else {
          return `"${String(value).replace(/"/g, '""')}"`;
        }
      });

      csv += values.join(",") + "\n";
    });

    return csv;
  }
}

export default ExportService;
