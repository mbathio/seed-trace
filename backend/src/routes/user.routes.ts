import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Routes accessibles uniquement aux administrateurs et managers
router.get("/", authenticate, authorize(Role.ADMIN, Role.MANAGER), getAllUsers);

// Obtenir un utilisateur spécifique
router.get("/:id", authenticate, getUserById);

// Créer un nouvel utilisateur (admin uniquement)
router.post("/", authenticate, authorize(Role.ADMIN), createUser);

// Mettre à jour un utilisateur
router.put("/:id", authenticate, updateUser);

// Supprimer un utilisateur (admin uniquement)
router.delete("/:id", authenticate, authorize(Role.ADMIN), deleteUser);

// Changer son propre mot de passe
router.post("/change-password", authenticate, changePassword);

export default router;
