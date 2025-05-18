// backend/src/config/logger.ts

import { LogLevel } from "../services/logging.service";

// Configuration du logger
interface LoggerConfig {
  logDirectory: string;
  consoleOutput: boolean;
  fileOutput: boolean;
  minLevel: LogLevel;
  maxFileSize: number; // en octets
  maxFiles: number;
}

// Charger la configuration à partir des variables d'environnement
const getLoggerConfig = (): LoggerConfig => {
  return {
    logDirectory: process.env.LOG_DIRECTORY || "./logs",
    consoleOutput: process.env.LOG_CONSOLE !== "false",
    fileOutput: process.env.LOG_FILE !== "false",
    minLevel:
      (process.env.LOG_LEVEL as LogLevel) ||
      (process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG),
    maxFileSize: parseInt(process.env.LOG_MAX_FILE_SIZE || "10485760"), // 10 Mo par défaut
    maxFiles: parseInt(process.env.LOG_MAX_FILES || "10"),
  };
};

export default getLoggerConfig;
