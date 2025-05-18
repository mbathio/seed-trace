// backend/src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../app";
import { Role } from "@prisma/client";
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} from "../types/errors";
import Logger from "../services/logging.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw new AuthenticationError("Identifiants invalides ou compte inactif");
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError("Identifiants invalides");
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        issuer: "isra-seeds-api",
        subject: user.id.toString(),
      }
    );

    // Logger la connexion
    Logger.info(
      `User ${user.id} (${user.email}) logged in`,
      "Auth",
      {},
      user.id,
      req.ip
    );

    // Retourner les informations de l'utilisateur
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role = Role.TECHNICIAN } = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ValidationError("Cet email est déjà utilisé", "email");
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        issuer: "isra-seeds-api",
        subject: newUser.id.toString(),
      }
    );

    // Logger la création de l'utilisateur
    Logger.info(
      `User ${newUser.id} (${newUser.email}) created with role ${newUser.role}`,
      "Auth",
      {},
      req.user?.id,
      req.ip
    );

    // Retourner les informations de l'utilisateur
    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AuthenticationError();
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};
