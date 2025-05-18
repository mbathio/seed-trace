// backend/src/services/audit.service.ts

import { prisma } from "../config/database";
import Logger from "./logging.service";

/**
 * Types d'actions pouvant être auditées
 */
export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  READ = "READ",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  EXPORT = "EXPORT",
  DISTRIBUTE = "DISTRIBUTE",
  QUALITY_TEST = "QUALITY_TEST",
  PRODUCTION = "PRODUCTION",
  HARVEST = "HARVEST",
}

/**
 * Entités pouvant être auditées
 */
export enum AuditEntity {
  USER = "USER",
  SEED_LOT = "SEED_LOT",
  SEED_VARIETY = "SEED_VARIETY",
  QUALITY_CONTROL = "QUALITY_CONTROL",
  PARCEL = "PARCEL",
  MULTIPLIER = "MULTIPLIER",
  PRODUCTION = "PRODUCTION",
  DISTRIBUTED_LOT = "DISTRIBUTED_LOT",
}

/**
 * Interface pour les entrées d'audit
 */
interface AuditEntry {
  userId: number;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string | number;
  details?: any;
  ipAddress?: string;
}

/**
 * Service d'audit pour suivre les activités des utilisateurs
 */
export class AuditService {
  /**
   * Créer une entrée d'audit
   * @param entry Données de l'entrée d'audit
   * @returns L'entrée d'audit créée ou null en cas d'erreur
   */
  static async createAudit(entry: AuditEntry): Promise<any> {
    try {
      const { userId, action, entity, entityId, details, ipAddress } = entry;

      // Convertir les détails en chaîne JSON si nécessaire
      const detailsJson = details ? JSON.stringify(details) : null;

      // Convertir entityId en chaîne
      const entityIdStr = entityId.toString();

      // Pour une implémentation complète, il faudrait que le modèle Audit existe dans le schéma Prisma
      // Ce code simule la création d'un audit dans une table qui n'est pas encore créée

      // Journaliser l'action d'audit
      Logger.info(
        `AUDIT: User ${userId} performed ${action} on ${entity} ${entityIdStr}`,
        "AuditService",
        {
          action,
          entity,
          entityId: entityIdStr,
          details,
          ipAddress,
        },
        userId
      );

      return {
        id: Date.now(), // Simulé
        userId,
        action,
        entity,
        entityId: entityIdStr,
        details: detailsJson,
        ipAddress,
        createdAt: new Date(),
      };
    } catch (error) {
      Logger.error("Failed to create audit entry", "AuditService", {
        error,
        entry,
      });
      // En cas d'erreur, continuer sans bloquer l'application
      return null;
    }
  }

  /**
   * Récupérer les entrées d'audit
   * @param options Options de filtrage et de pagination
   * @returns Liste des entrées d'audit
   */
  static async getAudits(options: {
    userId?: number;
    entity?: AuditEntity;
    action?: AuditAction;
    entityId?: string | number;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      // Cette méthode est une simulation car le modèle Audit n'existe pas encore dans le schéma
      // Dans une implémentation réelle, nous utiliserions Prisma pour interroger la base de données

      const { page = 1, limit = 50 } = options;

      // Simuler des données d'audit
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    } catch (error) {
      Logger.error("Failed to retrieve audit entries", "AuditService", {
        error,
        options,
      });
      throw error;
    }
  }

  /**
   * Récupérer l'historique d'audit d'une entité spécifique
   * @param entity Type d'entité
   * @param entityId ID de l'entité
   * @param page Page à récupérer
   * @param limit Nombre d'entrées par page
   * @returns Liste des entrées d'audit pour l'entité
   */
  static async getEntityHistory(
    entity: AuditEntity,
    entityId: string | number,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    return this.getAudits({
      entity,
      entityId,
      page,
      limit,
    });
  }

  /**
   * Récupérer l'historique d'audit d'un utilisateur
   * @param userId ID de l'utilisateur
   * @param page Page à récupérer
   * @param limit Nombre d'entrées par page
   * @returns Liste des entrées d'audit pour l'utilisateur
   */
  static async getUserHistory(
    userId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    return this.getAudits({
      userId,
      page,
      limit,
    });
  }
}

export default AuditService;
