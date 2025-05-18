// backend/src/services/notification.service.ts

import { Role } from "@prisma/client";
import { prisma } from "../config/database";
import Logger from "./logging.service";

/**
 * Types de notifications
 */
export enum NotificationType {
  LOW_STOCK = "LOW_STOCK",
  QUALITY_CONTROL_FAILED = "QUALITY_CONTROL_FAILED",
  DISTRIBUTION_COMPLETED = "DISTRIBUTION_COMPLETED",
  HARVEST_COMPLETED = "HARVEST_COMPLETED",
  MAINTENANCE_REMINDER = "MAINTENANCE_REMINDER",
  SYSTEM_UPDATE = "SYSTEM_UPDATE",
  USER_ACCOUNT = "USER_ACCOUNT",
}

/**
 * Niveaux de priorité des notifications
 */
export enum NotificationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

/**
 * Interface pour les notifications
 */
interface Notification {
  id?: number;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  targetUsers?: number[]; // IDs des utilisateurs cibles
  targetRoles?: Role[]; // Rôles cibles
  relatedEntityType?: string; // Type d'entité liée (e.g., "SEED_LOT")
  relatedEntityId?: string | number; // ID de l'entité liée
  readBy?: number[]; // IDs des utilisateurs qui ont lu la notification
  createdAt?: Date;
  expiresAt?: Date; // Date d'expiration (optionnelle)
}

/**
 * Service de gestion des notifications
 */
export class NotificationService {
  /**
   * Crée une nouvelle notification
   * @param notification Données de la notification
   * @returns La notification créée
   */
  static async createNotification(notification: Notification): Promise<any> {
    try {
      // En l'absence d'une implémentation réelle, nous simulons la création
      const newNotification = {
        id: Date.now(),
        ...notification,
        createdAt: new Date(),
        readBy: [],
      };

      // Journaliser la création de la notification
      Logger.info(
        `Notification created: ${notification.title}`,
        "NotificationService",
        {
          type: notification.type,
          priority: notification.priority,
          targetUsers: notification.targetUsers,
          targetRoles: notification.targetRoles,
        }
      );

      // Dans une implémentation réelle, on stockerait la notification dans la base de données
      // Et on enverrait potentiellement des notifications en temps réel (websockets, etc.)

      return newNotification;
    } catch (error) {
      Logger.error(
        `Error creating notification: ${error.message}`,
        "NotificationService",
        { error, notification }
      );
      throw error;
    }
  }

  /**
   * Récupère les notifications pour un utilisateur spécifique
   * @param userId ID de l'utilisateur
   * @param onlyUnread Ne récupérer que les notifications non lues
   * @returns Liste des notifications
   */
  static async getNotificationsForUser(
    userId: number,
    onlyUnread: boolean = false
  ): Promise<any[]> {
    try {
      // Dans une implémentation réelle, on rechercherait les notifications dans la base de données
      // Pour l'instant, on renvoie un tableau vide
      return [];
    } catch (error) {
      Logger.error(
        `Error getting notifications for user: ${error.message}`,
        "NotificationService",
        { error, userId, onlyUnread }
      );
      throw error;
    }
  }

  /**
   * Marque une notification comme lue
   * @param notificationId ID de la notification
   * @param userId ID de l'utilisateur
   * @returns Résultat de l'opération
   */
  static async markAsRead(
    notificationId: number,
    userId: number
  ): Promise<boolean> {
    try {
      // Simuler le marquage comme lu
      Logger.info(
        `Notification ${notificationId} marked as read by user ${userId}`,
        "NotificationService"
      );
      return true;
    } catch (error) {
      Logger.error(
        `Error marking notification as read: ${error.message}`,
        "NotificationService",
        { error, notificationId, userId }
      );
      return false;
    }
  }

  /**
   * Créer une notification de stock bas
   * @param seedLotId ID du lot
   * @param currentQuantity Quantité actuelle
   * @param threshold Seuil d'alerte
   */
  static async createLowStockNotification(
    seedLotId: string,
    currentQuantity: number,
    threshold: number
  ): Promise<void> {
    try {
      // Chercher les détails du lot
      const seedLot = await prisma.seedLot.findUnique({
        where: { id: seedLotId },
        include: { variety: true },
      });

      if (!seedLot) {
        throw new Error(`Lot non trouvé: ${seedLotId}`);
      }

      // Créer et envoyer la notification
      await this.createNotification({
        type: NotificationType.LOW_STOCK,
        title: `Stock bas - ${seedLot.variety.name} (${seedLot.level})`,
        message: `Le lot ${seedLot.id} (${seedLot.variety.name}, niveau ${seedLot.level}) a atteint un niveau de stock bas: ${currentQuantity} kg (seuil: ${threshold} kg).`,
        priority: NotificationPriority.MEDIUM,
        targetRoles: [Role.MANAGER, Role.ADMIN, Role.TECHNICIAN],
        relatedEntityType: "SEED_LOT",
        relatedEntityId: seedLotId,
      });
    } catch (error) {
      Logger.error(
        `Error creating low stock notification: ${error.message}`,
        "NotificationService",
        { error, seedLotId, currentQuantity, threshold }
      );
    }
  }

  /**
   * Créer une notification d'échec de contrôle qualité
   * @param qualityControlId ID du contrôle qualité
   * @param seedLotId ID du lot
   */
  static async createQualityControlFailedNotification(
    qualityControlId: number,
    seedLotId: string
  ): Promise<void> {
    try {
      // Chercher les détails du contrôle qualité et du lot
      const qualityControl = await prisma.qualityControl.findUnique({
        where: { id: qualityControlId },
        include: {
          lot: {
            include: { variety: true },
          },
        },
      });

      if (!qualityControl) {
        throw new Error(`Contrôle qualité non trouvé: ${qualityControlId}`);
      }

      // Créer et envoyer la notification
      await this.createNotification({
        type: NotificationType.QUALITY_CONTROL_FAILED,
        title: `Échec contrôle qualité - ${qualityControl.lot.variety.name} (${qualityControl.lot.level})`,
        message: `Le contrôle qualité du lot ${qualityControl.lotId} (${qualityControl.lot.variety.name}, niveau ${qualityControl.lot.level}) a échoué. Taux de germination: ${qualityControl.germinationRate}%, pureté variétale: ${qualityControl.varietyPurity}%.`,
        priority: NotificationPriority.HIGH,
        targetRoles: [
          Role.MANAGER,
          Role.ADMIN,
          Role.RESEARCHER,
          Role.INSPECTOR,
        ],
        relatedEntityType: "QUALITY_CONTROL",
        relatedEntityId: qualityControlId,
      });
    } catch (error) {
      Logger.error(
        `Error creating quality control failed notification: ${error.message}`,
        "NotificationService",
        { error, qualityControlId, seedLotId }
      );
    }
  }

  /**
   * Créer une notification de distribution complétée
   * @param distributionId ID de la distribution
   */
  static async createDistributionCompletedNotification(
    distributionId: number
  ): Promise<void> {
    try {
      // Chercher les détails de la distribution
      const distribution = await prisma.distributedLot.findUnique({
        where: { id: distributionId },
        include: {
          lot: {
            include: { variety: true },
          },
          multiplier: true,
        },
      });

      if (!distribution) {
        throw new Error(`Distribution non trouvée: ${distributionId}`);
      }

      // Créer et envoyer la notification
      await this.createNotification({
        type: NotificationType.DISTRIBUTION_COMPLETED,
        title: `Distribution complétée - ${distribution.lot.variety.name}`,
        message: `Une distribution de ${distribution.quantity} kg du lot ${distribution.lotId} (${distribution.lot.variety.name}, niveau ${distribution.lot.level}) a été complétée pour le multiplicateur ${distribution.multiplier.name}.`,
        priority: NotificationPriority.MEDIUM,
        targetRoles: [Role.MANAGER, Role.ADMIN],
        relatedEntityType: "DISTRIBUTED_LOT",
        relatedEntityId: distributionId,
      });
    } catch (error) {
      Logger.error(
        `Error creating distribution completed notification: ${error.message}`,
        "NotificationService",
        { error, distributionId }
      );
    }
  }

  /**
   * Créer une notification de récolte complétée
   * @param productionId ID de la production
   */
  static async createHarvestCompletedNotification(
    productionId: number
  ): Promise<void> {
    try {
      // Chercher les détails de la production
      const production = await prisma.production.findUnique({
        where: { id: productionId },
        include: {
          lot: {
            include: { variety: true },
          },
          parcel: true,
        },
      });

      if (!production) {
        throw new Error(`Production non trouvée: ${productionId}`);
      }

      // Créer et envoyer la notification
      await this.createNotification({
        type: NotificationType.HARVEST_COMPLETED,
        title: `Récolte complétée - ${production.lot.variety.name}`,
        message: `La récolte de la production ${productionId} (${production.lot.variety.name}, niveau ${production.lot.level}) a été complétée avec un rendement de ${production.yield} kg sur la parcelle ${production.parcel.code}.`,
        priority: NotificationPriority.MEDIUM,
        targetRoles: [
          Role.MANAGER,
          Role.ADMIN,
          Role.RESEARCHER,
          Role.TECHNICIAN,
        ],
        relatedEntityType: "PRODUCTION",
        relatedEntityId: productionId,
      });
    } catch (error) {
      Logger.error(
        `Error creating harvest completed notification: ${error.message}`,
        "NotificationService",
        { error, productionId }
      );
    }
  }

  /**
   * Créer une notification de rappel de maintenance pour une parcelle
   * @param parcelId ID de la parcelle
   * @param messageContent Contenu du message
   */
  static async createParcelMaintenanceReminder(
    parcelId: number,
    messageContent: string
  ): Promise<void> {
    try {
      // Chercher les détails de la parcelle
      const parcel = await prisma.parcel.findUnique({
        where: { id: parcelId },
      });

      if (!parcel) {
        throw new Error(`Parcelle non trouvée: ${parcelId}`);
      }

      // Créer et envoyer la notification
      await this.createNotification({
        type: NotificationType.MAINTENANCE_REMINDER,
        title: `Rappel de maintenance - Parcelle ${parcel.code}`,
        message: messageContent,
        priority: NotificationPriority.LOW,
        targetRoles: [Role.TECHNICIAN, Role.ADMIN],
        relatedEntityType: "PARCEL",
        relatedEntityId: parcelId,
      });
    } catch (error) {
      Logger.error(
        `Error creating parcel maintenance reminder: ${error.message}`,
        "NotificationService",
        { error, parcelId, messageContent }
      );
    }
  }

  /**
   * Envoyer une notification à tous les utilisateurs d'un rôle spécifique
   * @param title Titre de la notification
   * @param message Message de la notification
   * @param roles Rôles cibles
   * @param priority Priorité de la notification
   */
  static async notifyUsersByRole(
    title: string,
    message: string,
    roles: Role[],
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ): Promise<void> {
    try {
      // Créer et envoyer la notification
      await this.createNotification({
        type: NotificationType.SYSTEM_UPDATE,
        title,
        message,
        priority,
        targetRoles: roles,
      });
    } catch (error) {
      Logger.error(
        `Error notifying users by role: ${error.message}`,
        "NotificationService",
        { error, title, message, roles, priority }
      );
    }
  }
}

export default NotificationService;
