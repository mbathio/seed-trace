import { Request, Response, NextFunction } from "express";

// Interface pour les erreurs personnalisées
interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  field?: string;
}

// Créer une erreur avec un code HTTP personnalisé
export const createError = (
  message: string,
  statusCode: number,
  field?: string
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  if (field) error.field = field;
  return error;
};

// Middleware pour la gestion des erreurs
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Logger l'erreur
  console.error(err.stack);

  // Statut HTTP par défaut
  const statusCode = err.statusCode || 500;

  // Objet de réponse
  const response: any = {
    message: err.message || "Une erreur inattendue s'est produite",
    status: statusCode,
  };

  // Ajouter des détails supplémentaires en fonction du type d'erreur
  if (err.field) {
    response.field = err.field;
  }

  // En développement, ajouter la pile d'erreurs
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  // En production, cacher les détails des erreurs non opérationnelles
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    response.message = "Une erreur interne s'est produite";
    delete response.stack;
  }

  res.status(statusCode).json(response);
};

// Middleware pour les routes non trouvées
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = createError(`Route non trouvée: ${req.originalUrl}`, 404);
  next(error);
};

// Exportation des fonctions helpers
export const badRequest = (message: string, field?: string) =>
  createError(message, 400, field);
export const unauthorized = (message = "Non autorisé") =>
  createError(message, 401);
export const forbidden = (message = "Accès refusé") =>
  createError(message, 403);
export const notFound = (message = "Ressource non trouvée") =>
  createError(message, 404);
export const conflict = (message: string, field?: string) =>
  createError(message, 409, field);
export const serverError = (message = "Erreur interne du serveur") =>
  createError(message, 500);
