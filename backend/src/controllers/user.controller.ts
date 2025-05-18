import { Request, Response } from "express";
import { prisma } from "../app";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

// Obtenir tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Vérifier si l'utilisateur qui fait la requête est admin
    if (req.user?.role !== Role.ADMIN && req.user?.role !== Role.MANAGER) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const { role, isActive, search } = req.query;

    const filters: any = {};

    if (role) {
      filters.role = role as Role;
    }

    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }

    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
};

// Obtenir un utilisateur par son ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur qui fait la requête est admin ou s'il demande ses propres informations
    if (
      req.user?.role !== Role.ADMIN &&
      req.user?.role !== Role.MANAGER &&
      req.user?.id !== parseInt(id)
    ) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
    });
  }
};

// Créer un nouvel utilisateur (pour l'admin)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé",
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
    });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, isActive, currentPassword, newPassword } =
      req.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier les permissions
    const isAdmin = req.user?.role === Role.ADMIN;
    const isManager = req.user?.role === Role.MANAGER;
    const isSelf = req.user?.id === parseInt(id);

    // Seul l'admin peut changer le rôle et le statut d'activation
    if (
      (role && role !== existingUser.role && !isAdmin) ||
      (isActive !== undefined && isActive !== existingUser.isActive && !isAdmin)
    ) {
      return res.status(403).json({
        message: "Vous n'avez pas l'autorisation de modifier ces champs",
      });
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé",
        });
      }
    }

    // Préparation des données de mise à jour
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (isAdmin && role) updateData.role = role as Role;
    if (isAdmin && isActive !== undefined) updateData.isActive = isActive;

    // Traitement du changement de mot de passe
    if (newPassword) {
      // Si c'est l'utilisateur lui-même qui change son mot de passe, il doit fournir son mot de passe actuel
      if (isSelf && !isAdmin) {
        if (!currentPassword) {
          return res.status(400).json({
            message: "Le mot de passe actuel est requis",
          });
        }

        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          existingUser.password
        );

        if (!isPasswordValid) {
          return res.status(400).json({
            message: "Le mot de passe actuel est incorrect",
          });
        }
      }

      // Hasher le nouveau mot de passe
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
    });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Seul l'admin peut supprimer des utilisateurs
    if (req.user?.role !== Role.ADMIN) {
      return res.status(403).json({
        message: "Vous n'avez pas l'autorisation de supprimer des utilisateurs",
      });
    }

    // Empêcher la suppression de soi-même
    if (req.user?.id === parseInt(id)) {
      return res.status(400).json({
        message: "Vous ne pouvez pas supprimer votre propre compte",
      });
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
    });
  }
};

// Changer le mot de passe (pour soi-même)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Les deux mots de passe sont requis",
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Le mot de passe actuel est incorrect",
      });
    }

    // Hasher et mettre à jour le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        password: hashedPassword,
      },
    });

    return res.json({ message: "Mot de passe modifié avec succès" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Erreur lors du changement de mot de passe",
    });
  }
};
