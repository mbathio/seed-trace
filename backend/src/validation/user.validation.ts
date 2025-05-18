// backend/src/validation/user.validation.ts

import { Role } from "@prisma/client";

/**
 * Schémas de validation pour les utilisateurs
 */

// Schéma pour la création d'un utilisateur
export const createUserSchema = {
  name: {
    required: true,
    type: "string",
    min: 2,
    max: 100,
  },
  email: {
    required: true,
    type: "string",
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    required: true,
    type: "string",
    min: 8,
    custom: (value: string) => {
      // Au moins une majuscule, une minuscule, un chiffre et un caractère spécial
      if (
        !value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      ) {
        return "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial";
      }
      return true;
    },
  },
  role: {
    required: true,
    enum: Object.values(Role),
  },
};

// Schéma pour la connexion
export const loginSchema = {
  email: {
    required: true,
    type: "string",
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    required: true,
    type: "string",
    min: 8,
  },
};

// Schéma pour la mise à jour d'un utilisateur
export const updateUserSchema = {
  name: {
    required: false,
    type: "string",
    min: 2,
    max: 100,
  },
  email: {
    required: false,
    type: "string",
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  role: {
    required: false,
    enum: Object.values(Role),
  },
  isActive: {
    required: false,
    type: "boolean",
  },
  currentPassword: {
    required: false,
    type: "string",
  },
  newPassword: {
    required: false,
    type: "string",
    min: 8,
    custom: (value: string) => {
      // Au moins une majuscule, une minuscule, un chiffre et un caractère spécial
      if (
        !value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      ) {
        return "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial";
      }
      return true;
    },
  },
};

// Schéma pour le changement de mot de passe
export const changePasswordSchema = {
  currentPassword: {
    required: true,
    type: "string",
  },
  newPassword: {
    required: true,
    type: "string",
    min: 8,
    custom: (value: string) => {
      // Au moins une majuscule, une minuscule, un chiffre et un caractère spécial
      if (
        !value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      ) {
        return "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial";
      }
      return true;
    },
  },
};

// Schéma pour le filtrage des utilisateurs
export const filterUserSchema = {
  role: {
    required: false,
    enum: Object.values(Role),
  },
  isActive: {
    required: false,
    type: "boolean",
  },
  search: {
    required: false,
    type: "string",
  },
};
