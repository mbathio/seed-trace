// backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../app";
import { Role } from "@prisma/client";
import { AuthenticationError, AuthorizationError } from "../types/errors";
import Logger from "../services/logging.service";

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: Role;
      };
    }
  }
}

/**
 * Middleware d'authentification - Vérifie le token JWT et ajoute les informations de l'utilisateur à la requête
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Authentification requise");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
        email: string;
        role: Role;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new AuthenticationError("Utilisateur non trouvé ou inactif");
      }

      // Ajouter l'utilisateur à la requête
      req.user = { id: user.id, email: user.email, role: user.role };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthenticationError("Token invalide");
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new AuthenticationError("Token expiré");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware d'autorisation - Vérifie si l'utilisateur a un des rôles spécifiés
 * @param roles Les rôles autorisés
 */
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentification requise");
      }

      if (!roles.includes(req.user.role)) {
        Logger.warn(
          `Unauthorized access attempt: User ${req.user.id} with role ${
            req.user.role
          } tried to access a resource requiring roles: ${roles.join(", ")}`,
          "Authorization",
          {},
          req.user.id,
          req.ip
        );

        throw new AuthorizationError(
          "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware qui vérifie que l'utilisateur est administrateur ou qu'il est le propriétaire de la ressource
 * @param getUserIdFromParams Fonction qui extrait l'ID de l'utilisateur propriétaire à partir des paramètres de la requête
 */
export const authorizeOwnerOrAdmin = (
  getUserIdFromParams: (req: Request) => number
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentification requise");
      }

      const ownerId = getUserIdFromParams(req);

      if (req.user.role === Role.ADMIN || req.user.id === ownerId) {
        return next();
      }

      Logger.warn(
        `Unauthorized access attempt: User ${req.user.id} tried to access a resource owned by user ${ownerId}`,
        "Authorization",
        {},
        req.user.id,
        req.ip
      );

      throw new AuthorizationError(
        "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource"
      );
    } catch (error) {
      next(error);
    }
  };
};
