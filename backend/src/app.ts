// backend/src/app.ts - Ajout du body parser
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config/environment";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";

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
import statisticsRoutes from "./routes/statistics";
import exportRoutes from "./routes/export";

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// 🔴 IMPORTANT: Body parsing middleware DOIT être avant les routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      config.client.url,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
    ];

    if (!origin && config.environment === "development") {
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Non autorisé par CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["X-Total-Count"],
  maxAge: 86400, // 24 heures
};

app.use(cors(corsOptions));

// Handler spécifique pour OPTIONS
app.options("*", cors(corsOptions));

// Logging
if (config.environment !== "test") {
  app.use(morgan("combined"));
}

// Route racine
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
app.use("/api/statistics", authMiddleware, statisticsRoutes);
app.use("/api/export", authMiddleware, exportRoutes);

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
