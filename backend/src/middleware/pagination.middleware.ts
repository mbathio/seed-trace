// backend/src/middleware/pagination.middleware.ts

import { Request, Response, NextFunction } from "express";

interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Middleware pour la gestion de la pagination
 * @param options Options de pagination
 */
export const pagination = (options: PaginationOptions = {}) => {
  const defaultLimit = options.defaultLimit || 10;
  const maxLimit = options.maxLimit || 100;

  return (req: Request, res: Response, next: NextFunction) => {
    // Récupérer les paramètres de pagination
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      maxLimit,
      Math.max(1, parseInt(req.query.limit as string) || defaultLimit)
    );
    const skip = (page - 1) * limit;

    // Ajouter les paramètres à la requête
    req.pagination = {
      page,
      limit,
      skip,
    };

    next();
  };
};

// Étendre l'interface Request pour inclure la pagination
declare global {
  namespace Express {
    interface Request {
      pagination?: {
        page: number;
        limit: number;
        skip: number;
      };
    }
  }
}
