// backend/src/server.ts
import app from "./app";
import { config } from "./config/environment";
import { logger } from "./utils/logger";
import { connectDatabase } from "./config/database";
import fs from "fs";
import path from "path";

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info("Base de données connectée avec succès");

    // Start server
    const server = app.listen(config.server.port, () => {
      logger.info(`Serveur démarré sur le port ${config.server.port}`);
      logger.info(`Environnement: ${config.environment}`);
      logger.info(`URL de l'API: http://localhost:${config.server.port}`);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("Signal SIGTERM reçu, arrêt gracieux du serveur...");
      server.close(() => {
        logger.info("Serveur fermé");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("Signal SIGINT reçu, arrêt gracieux du serveur...");
      server.close(() => {
        logger.info("Serveur fermé");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
}

const logsDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

startServer();
