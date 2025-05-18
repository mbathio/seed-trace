import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../app";
import { Role } from "@prisma/client";
import { unauthorized, forbidden } from "./error.middleware";

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
      return next(unauthorized("Authentification requise"));
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
        return next(unauthorized("Utilisateur non trouvé ou inactif"));
      }

      req.user = { id: user.id, email: user.email, role: user.role };
      next();
    } catch (error) {
      return next(unauthorized("Token invalide ou expiré"));
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
    if (!req.user) {
      return next(unauthorized("Authentification requise"));
    }

    if (!roles.includes(req.user.role)) {
      return next(forbidden("Accès non autorisé"));
    }

    next();
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
    if (!req.user) {
      return next(unauthorized("Authentification requise"));
    }

    const ownerId = getUserIdFromParams(req);

    if (req.user.role === Role.ADMIN || req.user.id === ownerId) {
      return next();
    }

    return next(forbidden("Accès non autorisé"));
  };
};
