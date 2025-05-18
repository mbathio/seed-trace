// backend/src/config/index.ts

import getAuthConfig from "./auth";
import getLoggerConfig from "./logger";
import { testDatabaseConnection } from "./database";

// Configuration principale de l'application
interface AppConfig {
  port: number;
  env: "development" | "production" | "test";
  api: {
    prefix: string;
    pagination: {
      defaultLimit: number;
      maxLimit: number;
    };
  };
  auth: ReturnType<typeof getAuthConfig>;
  logger: ReturnType<typeof getLoggerConfig>;
}

// Charger la configuration de l'application
const getConfig = (): AppConfig => {
  // Déterminer l'environnement
  const environment = (process.env.NODE_ENV ||
    "development") as AppConfig["env"];

  return {
    port: parseInt(process.env.PORT || "5000"),
    env: environment,
    api: {
      prefix: process.env.API_PREFIX || "/api",
      pagination: {
        defaultLimit: parseInt(process.env.API_DEFAULT_LIMIT || "10"),
        maxLimit: parseInt(process.env.API_MAX_LIMIT || "100"),
      },
    },
    auth: getAuthConfig(),
    logger: getLoggerConfig(),
  };
};

// Fonction pour initialiser la configuration
export const initConfig = async (): Promise<AppConfig> => {
  const config = getConfig();

  // Vérifier la connexion à la base de données
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    throw new Error("Unable to connect to the database");
  }

  return config;
};

export default getConfig();
