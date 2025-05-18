import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../app";
import { Role } from "@prisma/client";

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

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authentification requise" });
      return; // Retourner ici au lieu de retourner la réponse
    }

    const token = authHeader.split(" ")[1];
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
      res.status(401).json({ message: "Utilisateur non trouvé ou inactif" });
      return; // Retourner ici au lieu de retourner la réponse
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
    return; // Retourner ici au lieu de retourner la réponse
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentification requise" });
      return; // Retourner ici au lieu de retourner la réponse
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Accès non autorisé" });
      return; // Retourner ici au lieu de retourner la réponse
    }

    next();
  };
};
