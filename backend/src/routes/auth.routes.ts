// backend/src/routes/auth.routes.ts

import { Router } from "express";
import { login, register, me } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { loginSchema, createUserSchema } from "../validation";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(createUserSchema), register);
router.get("/me", authenticate, me);

export default router;
