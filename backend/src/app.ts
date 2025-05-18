import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import routes from "./routes";

// Initialisation
const app = express();
export const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", routes);

// Route de test pour vérifier que le serveur fonctionne
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "ISRA Seed Traceability API is running" });
});

// Gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Une erreur est survenue",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});

// 404 - Route non trouvée
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route non trouvée" });
});

export default app;
