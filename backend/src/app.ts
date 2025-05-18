// backend/src/app.ts

import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { prisma } from "./config/database";
import routes from "./routes";
import config from "./config";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { pagination } from "./middleware/pagination.middleware";
import requestLogger from "./middleware/requestLogger.middleware";
import { noCache } from "./middleware/cacheControl.middleware";
import { standardLimiter } from "./middleware/rateLimiter.middleware";
import Logger from "./services/logging.service";
import path from "path";

// Initialisation de l'application Express
const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors(config.auth.cors));

// Middlewares de logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}
app.use(requestLogger);

// Middlewares pour traiter le corps des requêtes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiter
app.use(standardLimiter);

// Middleware de pagination global
app.use(
  pagination({
    defaultLimit: config.api.pagination.defaultLimit,
    maxLimit: config.api.pagination.maxLimit,
  })
);

// API Docs en développement
if (process.env.NODE_ENV === "development") {
  app.use("/api-docs", express.static(path.join(__dirname, "../docs")));
}

// Route de base pour vérifier que l'API fonctionne
app.get("/", noCache, (req: Request, res: Response) => {
  res.json({
    message: "ISRA Seed Traceability API is running",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Route de statut pour les healthchecks
app.get("/status", noCache, async (req: Request, res: Response) => {
  try {
    // Vérifier la connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: "connected",
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error:
        process.env.NODE_ENV === "development"
          ? error
          : "Database connection error",
    });
  }
});

// Routes API
app.use(config.api.prefix, routes);

// Middleware 404 pour les routes non trouvées
app.use(notFoundHandler);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Exporter les objets app et prisma
export { app, prisma };
