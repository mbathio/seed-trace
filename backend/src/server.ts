// backend/src/server.ts

import dotenv from "dotenv";
import http from "http";
import { app, prisma } from "./app";
import Logger from "./services/logging.service";
import { initConfig } from "./config";

// Charger les variables d'environnement avant tout
dotenv.config();

// Définir le port
const PORT = process.env.PORT || 5000;

// Créer le serveur HTTP
const server = http.createServer(app);

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Initialiser la configuration
    await initConfig();
    Logger.info("Configuration initialized successfully", "Server");

    // Démarrer le serveur
    server.listen(PORT, () => {
      Logger.info(
        `🚀 Server running on port ${PORT} in ${
          process.env.NODE_ENV || "development"
        } mode`,
        "Server"
      );
      console.log(`🚀 Server is running at http://localhost:${PORT}`);

      if (process.env.NODE_ENV === "development") {
        console.log(
          `📚 API Documentation available at http://localhost:${PORT}/api-docs`
        );
      }
    });

    // Gérer les événements du serveur
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      // Gérer les erreurs spécifiques
      switch (error.code) {
        case "EACCES":
          Logger.error(`Port ${PORT} requires elevated privileges`, "Server");
          process.exit(1);
          break;
        case "EADDRINUSE":
          Logger.error(`Port ${PORT} is already in use`, "Server");
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
  } catch (error) {
    Logger.error("Failed to start server", "Server", { error });
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

// Graceful shutdown
const shutdownGracefully = async (signal: string) => {
  Logger.info(`${signal} received. Shutting down gracefully...`, "Process");
  console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

  try {
    // Arrêter d'accepter de nouvelles connexions
    server.close(async () => {
      Logger.info("HTTP server closed", "Process");
      console.log("✅ HTTP server closed");

      // Fermer la connexion à la base de données
      await prisma.$disconnect();
      Logger.info("Database connection closed", "Process");
      console.log("✅ Database connection closed");

      // Fermer proprement le logger
      Logger.info("Server shutdown complete", "Process");
      console.log("👋 Server shutdown complete");

      process.exit(0);
    });

    // Si le serveur ne se ferme pas après 10 secondes, forcer la fermeture
    setTimeout(() => {
      Logger.warn("Forcing shutdown after timeout", "Process");
      console.warn("⚠️ Forcing shutdown after timeout");
      process.exit(1);
    }, 10000);
  } catch (error) {
    Logger.error("Error during graceful shutdown", "Process", { error });
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Écouteurs pour la fermeture propre
process.on("SIGINT", () => shutdownGracefully("SIGINT"));
process.on("SIGTERM", () => shutdownGracefully("SIGTERM"));

// Gestion des erreurs non captées
process.on("unhandledRejection", (reason: Error) => {
  Logger.error(`Unhandled Rejection: ${reason.message}`, "Process", {
    stack: reason.stack,
  });
  console.error("❌ Unhandled Rejection:", reason.message);
  console.error(reason.stack);
});

process.on("uncaughtException", (error: Error) => {
  Logger.error(`Uncaught Exception: ${error.message}`, "Process", {
    stack: error.stack,
  });
  console.error("❌ Uncaught Exception:", error.message);
  console.error(error.stack);

  // En production, on pourrait vouloir redémarrer l'application proprement
  if (process.env.NODE_ENV === "production") {
    console.error("❗ Critical error occurred. Shutting down...");
    shutdownGracefully("UNCAUGHT_EXCEPTION");
  }
});
