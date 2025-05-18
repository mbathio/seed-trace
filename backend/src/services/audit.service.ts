/**
 * Service d'audit pour suivre les activités importantes
 * Enregistre les actions des utilisateurs dans la base de données
 */

import { PrismaClient } from "@prisma/client";
import Logger from "./logging.service";

const prisma = new PrismaClient();

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
 * Service d'audit
 */
export class AuditService {
  /**
   * Créer une entrée d'audit
   * @param entry Données de l'entrée d'audit
   * @returns L'entrée d'audit créée
   */
  static async createAudit(entry: AuditEntry): Promise<any> {
    try {
      const { userId, action, entity, entityId, details, ipAddress } = entry;

      // Convertir les détails en chaîne JSON si nécessaire
      const detailsJson = details ? JSON.stringify(details) : null;

      // Créer l'entrée d'audit dans la base de données
      // Note: Ce code assume que vous avez un modèle Audit dans votre schéma Prisma
      // Si ce n'est pas le cas, il faudra l'ajouter
      const audit = await prisma.$executeRaw`
        INSERT INTO "Audit" (
          "userId", "action", "entity", "entityId", "details", "ipAddress", "createdAt"
        ) VALUES (
          ${userId}, ${action}, ${entity}, ${entityId.toString()}, ${detailsJson}, ${ipAddress}, NOW()
        ) RETURNING *;
      `;

      Logger.debug(
        `Audit created: ${action} on ${entity} ${entityId}`,
        "AuditService",
        { userId }
      );

      return audit;
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
      const {
        userId,
        entity,
        action,
        entityId,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = options;

      // Construire la clause WHERE
      const where: any = {};

      if (userId) where.userId = userId;
      if (entity) where.entity = entity;
      if (action) where.action = action;
      if (entityId) where.entityId = entityId.toString();

      // Filtre par date
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      // Récupérer les entrées d'audit
      const audits = await prisma.$queryRaw`
        SELECT 
          a.*, 
          u.name as "userName", 
          u.email as "userEmail"
        FROM "Audit" a
        LEFT JOIN "User" u ON a."userId" = u.id
        WHERE ${where}
        ORDER BY a."createdAt" DESC
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
      `;

      // Compter le nombre total d'entrées
      const countResult = await prisma.$queryRaw`
        SELECT COUNT(*) as total FROM "Audit" WHERE ${where};
      `;

      const total = parseInt((countResult as any)[0].total);

      return {
        data: audits,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
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
