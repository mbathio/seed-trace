/**
 * Service pour la gestion des lots de semences
 */

import { SeedLevel, LotStatus, PrismaClient } from "@prisma/client";
import QRCodeService from "./qr.service";

const prisma = new PrismaClient();

export class SeedLotService {
  /**
   * Génère un identifiant unique pour un lot de semences
   * @param level Niveau de semence (GO, G1, G2, etc.)
   * @param varietyId Identifiant de la variété
   * @returns Identifiant unique pour le lot
   */
  static async generateLotId(
    level: SeedLevel,
    varietyId: number
  ): Promise<string> {
    const currentYear = new Date().getFullYear();
    const variety = await prisma.seedVariety.findUnique({
      where: { id: varietyId },
    });

    if (!variety) {
      throw new Error(`Variété non trouvée avec l'ID: ${varietyId}`);
    }

    // Compter le nombre de lots existants pour cette variété et ce niveau cette année
    const existingLots = await prisma.seedLot.count({
      where: {
        level,
        varietyId,
        id: {
          startsWith: `${variety.name
            .substring(0, 2)
            .toUpperCase()}-${level}-${currentYear}`,
        },
      },
    });

    // Générer le numéro séquentiel
    const sequentialNumber = (existingLots + 1).toString().padStart(3, "0");

    // Générer l'identifiant
    return `${variety.name
      .substring(0, 2)
      .toUpperCase()}-${level}-${currentYear}-${sequentialNumber}`;
  }

  /**
   * Génère la généalogie d'un lot (ancêtres et descendants)
   * @param lotId Identifiant du lot
   * @returns Objet contenant les ancêtres et descendants du lot
   */
  static async getGenealogy(lotId: string): Promise<{
    ancestors: any[];
    descendants: any[];
  }> {
    // Vérifier si le lot existe
    const lot = await prisma.seedLot.findUnique({
      where: { id: lotId },
    });

    if (!lot) {
      throw new Error(`Lot non trouvé: ${lotId}`);
    }

    // Récupérer les ancêtres (lots parents)
    const ancestors = await this.getAncestors(lotId);

    // Récupérer les descendants (lots enfants)
    const descendants = await this.getDescendants(lotId);

    return {
      ancestors,
      descendants,
    };
  }

  /**
   * Récupère tous les ancêtres d'un lot
   * @param lotId Identifiant du lot
   * @returns Tableau des lots ancêtres
   */
  static async getAncestors(lotId: string): Promise<any[]> {
    const ancestors: any[] = [];
    let currentLotId = lotId;

    while (true) {
      const lot = await prisma.seedLot.findUnique({
        where: { id: currentLotId },
        include: {
          parentLot: {
            include: {
              variety: true,
            },
          },
        },
      });

      if (!lot || !lot.parentLotId) {
        break;
      }

      ancestors.push({
        id: lot.parentLot.id,
        level: lot.parentLot.level,
        quantity: lot.parentLot.quantity,
        productionDate: lot.parentLot.productionDate,
        status: lot.parentLot.status,
        variety: {
          id: lot.parentLot.variety.id,
          name: lot.parentLot.variety.name,
        },
      });

      currentLotId = lot.parentLotId;
    }

    return ancestors;
  }

  /**
   * Récupère tous les descendants d'un lot de manière récursive
   * @param lotId Identifiant du lot
   * @returns Tableau des lots descendants
   */
  static async getDescendants(lotId: string): Promise<any[]> {
    const children = await prisma.seedLot.findMany({
      where: { parentLotId: lotId },
      include: {
        variety: true,
      },
    });

    if (children.length === 0) {
      return [];
    }

    const formattedChildren = children.map((child) => ({
      id: child.id,
      level: child.level,
      quantity: child.quantity,
      productionDate: child.productionDate,
      status: child.status,
      variety: {
        id: child.variety.id,
        name: child.variety.name,
      },
    }));

    // Récupérer de manière récursive les descendants des enfants
    const nestedDescendants = await Promise.all(
      children.map((child) => this.getDescendants(child.id))
    );

    // Aplatir le tableau de résultats
    return [...formattedChildren, ...nestedDescendants.flat()];
  }

  /**
   * Génère un code QR pour un lot et met à jour le lot avec le code généré
   * @param lotId Identifiant du lot
   * @returns URL data du code QR
   */
  static async generateQRCode(lotId: string): Promise<string> {
    // Récupérer les informations du lot
    const lot = await prisma.seedLot.findUnique({
      where: { id: lotId },
      include: {
        variety: true,
      },
    });

    if (!lot) {
      throw new Error(`Lot non trouvé: ${lotId}`);
    }

    // Générer le code QR
    const qrCode = await QRCodeService.generateForSeedLot(
      lot.id,
      lot.variety.name,
      lot.level,
      lot.productionDate
    );

    // Mettre à jour le lot avec le code QR
    await prisma.seedLot.update({
      where: { id: lotId },
      data: { qrCode },
    });

    return qrCode;
  }

  /**
   * Calcule le stock disponible par niveau de semence et par variété
   * @returns Stock disponible par niveau et par variété
   */
  static async getAvailableStock(): Promise<any> {
    // Récupérer tous les lots actifs
    const activeLots = await prisma.seedLot.findMany({
      where: { status: LotStatus.ACTIVE },
      include: {
        variety: true,
      },
    });

    // Initialiser les résultats
    const stockByVariety: { [key: string]: any } = {};
    const stockByLevel: { [key: string]: number } = {
      GO: 0,
      G1: 0,
      G2: 0,
      G3: 0,
      R1: 0,
      R2: 0,
    };

    // Calculer le stock par variété et par niveau
    for (const lot of activeLots) {
      // Par variété
      if (!stockByVariety[lot.variety.name]) {
        stockByVariety[lot.variety.name] = {
          varietyId: lot.variety.id,
          varietyName: lot.variety.name,
          totalQuantity: 0,
          levels: {
            GO: 0,
            G1: 0,
            G2: 0,
            G3: 0,
            R1: 0,
            R2: 0,
          },
        };
      }

      stockByVariety[lot.variety.name].totalQuantity += lot.quantity;
      stockByVariety[lot.variety.name].levels[lot.level] += lot.quantity;

      // Par niveau
      stockByLevel[lot.level] += lot.quantity;
    }

    return {
      byVariety: Object.values(stockByVariety),
      byLevel: stockByLevel,
      total: Object.values(stockByLevel).reduce((sum, qty) => sum + qty, 0),
    };
  }

  /**
   * Vérifie si un lot peut être créé à partir d'un lot parent
   * @param parentLotId Identifiant du lot parent
   * @param targetLevel Niveau cible du nouveau lot
   * @param quantity Quantité souhaitée
   * @returns {boolean} true si la création est possible, false sinon
   */
  static async canCreateLotFromParent(
    parentLotId: string,
    targetLevel: SeedLevel,
    quantity: number
  ): Promise<{ possible: boolean; message?: string }> {
    // Récupérer le lot parent
    const parentLot = await prisma.seedLot.findUnique({
      where: { id: parentLotId },
    });

    if (!parentLot) {
      return { possible: false, message: "Lot parent non trouvé" };
    }

    // Vérifier que le lot parent est actif
    if (parentLot.status !== LotStatus.ACTIVE) {
      return {
        possible: false,
        message: "Le lot parent n'est pas actif",
      };
    }

    // Vérifier que la quantité demandée est disponible
    if (parentLot.quantity < quantity) {
      return {
        possible: false,
        message: `Quantité insuffisante disponible (${parentLot.quantity} kg)`,
      };
    }

    // Vérifier que le niveau cible est cohérent avec le niveau parent
    const levelOrder = {
      GO: 0,
      G1: 1,
      G2: 2,
      G3: 3,
      R1: 4,
      R2: 5,
    };

    const parentLevelIndex = levelOrder[parentLot.level];
    const targetLevelIndex = levelOrder[targetLevel];

    if (targetLevelIndex <= parentLevelIndex) {
      return {
        possible: false,
        message: `Le niveau cible (${targetLevel}) doit être supérieur au niveau parent (${parentLot.level})`,
      };
    }

    if (targetLevelIndex > parentLevelIndex + 1) {
      return {
        possible: false,
        message: `Le niveau cible (${targetLevel}) ne peut pas sauter plus d'un niveau par rapport au parent (${parentLot.level})`,
      };
    }

    return { possible: true };
  }
}

export default SeedLotService;
