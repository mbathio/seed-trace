import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import seedVarietyRoutes from "./seedVariety.routes";
import seedLotRoutes from "./seedLot.routes";
import qualityControlRoutes from "./qualityControl.routes";
import parcelRoutes from "./parcel.routes";
import multiplierRoutes from "./multiplier.routes";
import reportRoutes from "./report.routes";
import productionRoutes from "./production.routes";

const router = Router();

// Routes pour l'authentification
router.use("/auth", authRoutes);

// Routes pour la gestion des utilisateurs
router.use("/users", userRoutes);

// Routes pour la gestion des variétés de semences
router.use("/seed-varieties", seedVarietyRoutes);

// Routes pour la gestion des lots de semences
router.use("/seed-lots", seedLotRoutes);

// Routes pour la gestion des contrôles de qualité
router.use("/quality-controls", qualityControlRoutes);

// Routes pour la gestion des parcelles
router.use("/parcels", parcelRoutes);

// Routes pour la gestion des multiplicateurs
router.use("/multipliers", multiplierRoutes);

// Routes pour la génération de rapports
router.use("/reports", reportRoutes);

// Routes pour la gestion des productions
router.use("/productions", productionRoutes);

export default router;
