import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import seedVarietyRoutes from "./seedVariety.routes";
import seedLotRoutes from "./seedLot.routes";
import qualityControlRoutes from "./qualityControl.routes";
import parcelRoutes from "./parcel.routes";
import multiplierRoutes from "./multiplier.routes";
import reportRoutes from "./report.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/seed-varieties", seedVarietyRoutes);
router.use("/seed-lots", seedLotRoutes);
router.use("/quality-controls", qualityControlRoutes);
router.use("/parcels", parcelRoutes);
router.use("/multipliers", multiplierRoutes);
router.use("/reports", reportRoutes);

export default router;
