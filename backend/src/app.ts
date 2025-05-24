// backend/src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config/environment";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";
import { validateRequest } from "./middleware/validation";

// Routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import varietyRoutes from "./routes/varieties";
import parcelRoutes from "./routes/parcels";
import multiplierRoutes from "./routes/multipliers";
import seedLotRoutes from "./routes/seedLots";
import qualityControlRoutes from "./routes/qualityControls";
import productionRoutes from "./routes/productions";
import reportRoutes from "./routes/reports";

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: config.client.url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (config.environment !== "test") {
  app.use(morgan("combined"));
}

// 🆕 Route racine - Ajouter cette route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌾 API ISRA Seed Traceability System",
    data: {
      version: "1.0.0",
      environment: config.environment,
      timestamp: new Date().toISOString(),
      documentation: "/api/docs",
      health: "/health",
      endpoints: {
        auth: "/api/auth",
        users: "/api/users",
        varieties: "/api/varieties",
        parcels: "/api/parcels",
        multipliers: "/api/multipliers",
        seedLots: "/api/seed-lots",
        qualityControls: "/api/quality-controls",
        productions: "/api/productions",
        reports: "/api/reports",
      },
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "ISRA Seed Traceability System",
    version: "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: config.environment,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/varieties", authMiddleware, varietyRoutes);
app.use("/api/parcels", authMiddleware, parcelRoutes);
app.use("/api/multipliers", authMiddleware, multiplierRoutes);
app.use("/api/seed-lots", authMiddleware, seedLotRoutes);
app.use("/api/quality-controls", authMiddleware, qualityControlRoutes);
app.use("/api/productions", authMiddleware, productionRoutes);
app.use("/api/reports", authMiddleware, reportRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint non trouvé",
    data: null,
    errors: [`Route ${req.method} ${req.originalUrl} non trouvée`],
    availableEndpoints: [
      "GET /",
      "GET /health",
      "POST /api/auth/login",
      "GET /api/auth/me",
      "GET /api/varieties",
      "GET /api/seed-lots",
      "GET /api/multipliers",
      "GET /api/parcels",
      "GET /api/productions",
      "GET /api/quality-controls",
      "GET /api/reports",
    ],
  });
});

// Global error handler
app.use(errorHandler);

export default app;
