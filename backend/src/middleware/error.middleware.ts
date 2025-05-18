// backend/src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import {
  AppError,
  ValidationError,
  DatabaseError,
  NotFoundError,
} from "../types/errors";
import Logger from "../services/logging.service";

// Vérifier si une erreur est une erreur Prisma
const isPrismaError = (error: any): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientValidationError
  );
};

// Convertir les erreurs Prisma en erreurs d'application
const handlePrismaError = (error: any): AppError => {
  // Erreur de contrainte unique
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const field = (error.meta?.target as string[])?.join(", ") || "Un champ";
    return new ValidationError(`${field} doit être unique`, field);
  }

  // Erreur de contrainte de relation
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  ) {
    return new ValidationError(
      "Contrainte de relation violée. Un élément référencé n'existe pas ou ne peut pas être modifié.",
      error.meta?.field_name as string
    );
  }

  // Erreur d'enregistrement non trouvé
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2001"
  ) {
    return new NotFoundError("Ressource non trouvée");
  }

  // Erreur de validation
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError("Validation des données échouée");
  }

  // Erreur d'initialisation
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError(
      "Erreur lors de l'initialisation de la base de données"
    );
  }

  // Erreur inconnue
  return new DatabaseError("Erreur de base de données");
};

// Middleware pour les routes non trouvées
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new NotFoundError(
    `Route non trouvée: ${req.method} ${req.originalUrl}`
  );
  next(error);
};

// Middleware principal de gestion des erreurs
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
        500
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
        stack: error.stack,
      },
      requestId,
      url: req.originalUrl,
      method: req.method,
    },
    userId,
    req.ip
  );

  // Préparer la réponse
  const response: any = {
    status: "error",
    message: error.message,
    code: error.code,
  };

  // Ajouter le champ concerné si disponible
  if (error.field) {
    response.field = error.field;
  }

  // Ajouter les erreurs détaillées si disponibles
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Inclure la stack trace en développement
  if (process.env.NODE_ENV === "development" && !error.isOperational) {
    response.stack = error.stack;
  }

  // Envoyer la réponse
  return res.status(error.statusCode).json(response);
};

// Exportation des fonctions helpers
export const badRequest = (message: string, field?: string) =>
  new ValidationError(message, field);

export const unauthorized = (message = "Non autorisé") =>
  new AppError(message, 401, true, [], "UNAUTHORIZED");

export const forbidden = (message = "Accès refusé") =>
  new AppError(message, 403, true, [], "FORBIDDEN");

export const notFound = (message = "Ressource non trouvée") =>
  new NotFoundError(message);

export const conflict = (message: string, field?: string) =>
  new AppError(message, 409, true, [], "CONFLICT", field);

export const serverError = (message = "Erreur interne du serveur") =>
  new AppError(message, 500, false, [], "INTERNAL_SERVER_ERROR");
