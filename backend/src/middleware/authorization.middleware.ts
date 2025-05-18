/**
 * Middleware de gestion des erreurs amélioré
 * Traite les erreurs de manière cohérente et renvoie des réponses formatées
 */

import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError, DatabaseError } from "../types/errors";
import Logger from "../services/logging.service";

/**
 * Interface de réponse d'erreur
 */
interface ErrorResponse {
  status: "error";
  message: string;
  code?: string;
  field?: string;
  errors?: any[];
  stack?: string;
  timestamp: string;
}

/**
 * Vérifier si une erreur est une erreur Prisma
 * @param error Erreur à vérifier
 * @returns Booléen indiquant s'il s'agit d'une erreur Prisma
 */
const isPrismaError = (error: any): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  );
};

/**
 * Convertir les erreurs Prisma en erreurs d'application
 * @param error Erreur Prisma
 * @returns Erreur d'application
 */
const handlePrismaError = (error: any): AppError => {
  // Erreur de contrainte unique
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const field = (error.meta?.target as string[])?.join(", ") || "Un champ";
    return new DatabaseError(
      `${field} doit être unique`,
      "constraint_violation"
    );
  }

  // Erreur de contrainte de relation
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  ) {
    return new DatabaseError(
      "Contrainte de relation violée",
      "foreign_key_constraint"
    );
  }

  // Erreur d'enregistrement non trouvé
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2001"
  ) {
    return new DatabaseError("Enregistrement non trouvé", "record_not_found");
  }

  // Erreur de validation
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new DatabaseError(
      "Validation des données échouée",
      "validation_error"
    );
  }

  // Erreur d'initialisation
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError(
      "Erreur lors de l'initialisation de la base de données",
      "initialization_error"
    );
  }

  // Erreur inconnue
  return new DatabaseError("Erreur de base de données", "database_error");
};

/**
 * Middleware pour gérer les erreurs 404 (route non trouvée)
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    `Route non trouvée: ${req.method} ${req.originalUrl}`,
    404,
    true,
    [],
    "NOT_FOUND"
  );

  next(error);
};

/**
 * Middleware principal de gestion des erreurs
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupérer des informations sur la requête
  const requestId = req.headers["x-request-id"] || "";
  const userId = req.user?.id;

  let error: AppError;

  // Convertir les erreurs standard en AppError
  if (!(err instanceof AppError)) {
    // Vérifier les erreurs Prisma
    if (isPrismaError(err)) {
      error = handlePrismaError(err);
    } else {
      // Créer une AppError à partir de l'erreur standard
      error = new AppError(
        err.message || "Une erreur interne s'est produite",
        500,
        false
      );
    }
  } else {
    error = err;
  }

  // Journaliser l'erreur
  const logLevel = error.statusCode >= 500 ? "error" : "warn";
  Logger[logLevel](
    `[${error.statusCode}] ${error.message}`,
    "ErrorHandler",
    {
      error: {
        name: error.name,
        code: error.code,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        field: error.field,
      },
      requestId,
      url: req.originalUrl,
      method: req.method,
    },
    userId,
    req.ip
  );

  // Préparer la réponse
  const response: ErrorResponse = {
    status: "error",
    message: error.message,
    code: error.code,
    field: error.field,
    timestamp: new Date().toISOString(),
  };

  // Inclure les erreurs détaillées si disponibles
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Inclure la stack trace en développement
  if (process.env.NODE_ENV === "development" && error.statusCode >= 500) {
    response.stack = error.stack;
  }

  // Envoyer la réponse
  return res.status(error.statusCode).json(response);
};

/**
 * Middleware pour gérer les erreurs asynchrones
 * @param fn Fonction asynchrone à exécuter
 * @returns Middleware Express
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default {
  notFoundHandler,
  errorHandler,
  asyncHandler,
};
