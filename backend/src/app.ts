import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

// Initialisation de l'application Express
const app = express();

// Initialisation du client Prisma
export const prisma = new PrismaClient();

// Configuration CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  optionsSuccessStatus: 200,
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base pour vérifier que l'API fonctionne
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "ISRA Seed Traceability API is running",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes API
app.use("/api", routes);

// Middleware 404 pour les routes non trouvées
app.use(notFoundHandler);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on("unhandledRejection", (reason: Error) => {
  console.error("Unhandled Rejection:", reason.message);
  console.error(reason.stack);
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error.message);
  console.error(error.stack);
  // En production, on pourrait vouloir redémarrer l'application proprement ici
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

// Fermeture propre des connexions lors de l'arrêt de l'application
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
