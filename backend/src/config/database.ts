// backend/src/config/database.ts

import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import Logger from "../services/logging.service";

// Extension de Prisma Client pour ajouter des fonctionnalités
const prismaClientSingleton = () => {
  // Créer l'instance de Prisma
  const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
  });

  // Middleware pour logger les opérations
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    const duration = after - before;

    if (duration > 500) {
      // Logger les requêtes lentes
      Logger.warn(
        `Slow query detected: ${params.model}.${params.action} took ${duration}ms`,
        "Prisma",
        { params }
      );
    }

    return result;
  });

  // Middleware pour convertir les Decimal en number
  prisma.$use(async (params, next) => {
    const result = await next(params);

    // Fonction récursive pour convertir les Decimal en number
    const convertDecimal = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;

      if (obj instanceof Decimal) {
        return obj.toNumber();
      }

      if (Array.isArray(obj)) {
        return obj.map(convertDecimal);
      }

      if (typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
          newObj[key] = convertDecimal(obj[key]);
        }
        return newObj;
      }

      return obj;
    };

    return convertDecimal(result);
  });

  // Écoute des événements Prisma
  prisma.$on("query", (e: any) => {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.LOG_QUERIES === "true"
    ) {
      Logger.debug(`Query: ${e.query}`, "Prisma", {
        params: e.params,
        duration: e.duration,
      });
    }
  });

  prisma.$on("error", (e: any) => {
    Logger.error(`Database error: ${e.message}`, "Prisma", {
      target: e.target,
      stack: e.stack,
    });
  });

  prisma.$on("info", (e: any) => {
    Logger.info(`Database info: ${e.message}`, "Prisma");
  });

  prisma.$on("warn", (e: any) => {
    Logger.warn(`Database warning: ${e.message}`, "Prisma");
  });

  return prisma;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Contexte global pour stocker l'instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Récupérer ou créer une instance de Prisma Client
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// En développement, réinitialiser l'instance à chaque changement de fichier
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Fonction pour tester la connexion à la base de données
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Exécuter une requête simple pour vérifier la connexion
    await prisma.$queryRaw`SELECT 1`;
    Logger.info("Database connection test successful", "Database");
    return true;
  } catch (error) {
    Logger.error("Database connection test failed", "Database", { error });
    return false;
  }
};

export default prisma;
