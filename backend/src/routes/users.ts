// backend/src/routes/users.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateRequest } from "../middleware/validation";
import { requireRole } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum([
    "admin",
    "manager",
    "inspector",
    "multiplier",
    "guest",
    "technician",
    "researcher",
  ]),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z
    .enum([
      "admin",
      "manager",
      "inspector",
      "multiplier",
      "guest",
      "technician",
      "researcher",
    ])
    .optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z
    .string()
    .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
});

// GET /api/users
router.get("/", requireRole("manager", "admin"), UserController.getUsers);

// GET /api/users/:id
router.get("/:id", UserController.getUserById);

// POST /api/users
router.post(
  "/",
  requireRole("admin"),
  validateRequest({ body: createUserSchema }),
  UserController.createUser
);

// PUT /api/users/:id
router.put(
  "/:id",
  requireRole("manager", "admin"),
  validateRequest({ body: updateUserSchema }),
  UserController.updateUser
);

// DELETE /api/users/:id
router.delete("/:id", requireRole("admin"), UserController.deleteUser);

// PUT /api/users/:id/password
router.put(
  "/:id/password",
  validateRequest({ body: updatePasswordSchema }),
  UserController.updatePassword
);

export default router;
