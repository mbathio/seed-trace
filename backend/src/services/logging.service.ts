// backend/src/services/logging.service.ts

import fs from "fs";
import path from "path";
import { createWriteStream } from "fs";
import { format } from "date-fns";
import getLoggerConfig from "../config/logger";

/**
 * Niveaux de log supportés
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

/**
 * Interface d'entrée de log
 */
interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  userId?: number;
  ip?: string;
}

/**
 * Service de journalisation
 */
export class LoggingService {
  private static instance: LoggingService;
  private config = getLoggerConfig();
  private currentLogFile: string;
  private writeStream: fs.WriteStream | null = null;
  private currentFileSize: number = 0;

  /**
   * Constructeur privé (pattern Singleton)
   */
  private constructor() {
    // Créer le répertoire de logs s'il n'existe pas
    if (!fs.existsSync(this.config.logDirectory)) {
      fs.mkdirSync(this.config.logDirectory, { recursive: true });
    }

    // Initialiser le fichier de log
    this.initLogFile();
  }

  /**
   * Obtenir l'instance du logger (Singleton)
   * @returns Instance du logger
   */
  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Initialiser un nouveau fichier de log
   */
  private initLogFile(): void {
    if (!this.config.fileOutput) return;

    const timestamp = format(new Date(), "yyyy-MM-dd");
    const logsDir = this.config.logDirectory;

    // Fermer le flux d'écriture existant s'il y en a un
    if (this.writeStream) {
      this.writeStream.end();
      this.writeStream = null;
    }

    // Trouver le numéro du prochain fichier
    const existingLogs = fs
      .readdirSync(logsDir)
      .filter((file) => file.startsWith(`app-${timestamp}`))
      .sort();

    let fileNumber = 1;
    if (existingLogs.length > 0) {
      const lastFile = existingLogs[existingLogs.length - 1];
      const match = lastFile.match(/app-.*-(\d+)\.log/);
      if (match) {
        fileNumber = parseInt(match[1]) + 1;
      }
    }

    // Créer le nouveau fichier de log
    this.currentLogFile = path.join(
      logsDir,
      `app-${timestamp}-${fileNumber.toString().padStart(3, "0")}.log`
    );
    this.writeStream = createWriteStream(this.currentLogFile, { flags: "a" });
    this.currentFileSize = 0;

    // Gérer la rotation des fichiers (supprimer les plus anciens si nécessaire)
    this.cleanupOldLogs();
  }

  /**
   * Supprimer les fichiers de log les plus anciens
   */
  private cleanupOldLogs(): void {
    if (!this.config.fileOutput) return;

    const logFiles = fs
      .readdirSync(this.config.logDirectory)
      .filter((file) => file.endsWith(".log"))
      .map((file) => ({
        name: file,
        path: path.join(this.config.logDirectory, file),
        mtime: fs.statSync(path.join(this.config.logDirectory, file)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    // Supprimer les fichiers excédentaires
    if (logFiles.length > this.config.maxFiles) {
      logFiles.slice(this.config.maxFiles).forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error(`Failed to delete log file: ${file.path}`, error);
        }
      });
    }
  }

  /**
   * Vérifier si le niveau est suffisant pour être loggé
   * @param level Niveau de log
   * @returns Booléen indiquant si le log doit être enregistré
   */
  private isLevelEnabled(level: LogLevel): boolean {
    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
      LogLevel.FATAL,
    ];
    const configLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    return currentLevelIndex >= configLevelIndex;
  }

  /**
   * Formater une entrée de log
   * @param entry Entrée de log
   * @returns Chaîne formatée
   */
  private formatLogEntry(entry: LogEntry): string {
    const timestamp = format(entry.timestamp, "yyyy-MM-dd HH:mm:ss.SSS");
    let message = `[${timestamp}] [${entry.level}]`;

    if (entry.context) {
      message += ` [${entry.context}]`;
    }

    if (entry.userId) {
      message += ` [User ID: ${entry.userId}]`;
    }

    if (entry.ip) {
      message += ` [IP: ${entry.ip}]`;
    }

    message += `: ${entry.message}`;

    if (entry.data) {
      try {
        const dataStr =
          typeof entry.data === "string"
            ? entry.data
            : JSON.stringify(entry.data);
        message += ` - Data: ${dataStr}`;
      } catch (error) {
        message += ` - Data: [Could not stringify data]`;
      }
    }

    return message;
  }

  /**
   * Écrire une entrée dans le fichier de log
   * @param entry Entrée de log
   */
  private writeToFile(entry: LogEntry): void {
    if (!this.config.fileOutput) return;

    try {
      const formattedEntry = this.formatLogEntry(entry) + "\n";

      // Vérifier si le fichier existe et créer un nouveau si nécessaire
      if (!this.writeStream) {
        this.initLogFile();
      }

      // Vérifier si le fichier a atteint la taille maximale
      this.currentFileSize += Buffer.byteLength(formattedEntry);
      if (this.currentFileSize > this.config.maxFileSize) {
        this.initLogFile();
      }

      // Écrire dans le fichier
      if (this.writeStream) {
        this.writeStream.write(formattedEntry);
      }
    } catch (error) {
      console.error("Error writing to log file:", error);
    }
  }

  /**
   * Méthode générique pour logger un message
   * @param level Niveau de log
   * @param message Message à logger
   * @param context Contexte du log
   * @param data Données additionnelles
   * @param userId ID de l'utilisateur associé
   * @param ip Adresse IP de l'utilisateur
   */
  public log(
    level: LogLevel,
    message: string,
    context?: string,
    data?: any,
    userId?: number,
    ip?: string
  ): void {
    if (!this.isLevelEnabled(level)) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      data,
      userId,
      ip,
    };

    // Écrire dans la console si activé
    if (this.config.consoleOutput) {
      const formattedEntry = this.formatLogEntry(entry);

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedEntry);
          break;
        case LogLevel.INFO:
          console.info(formattedEntry);
          break;
        case LogLevel.WARN:
          console.warn(formattedEntry);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedEntry);
          break;
      }
    }

    // Écrire dans le fichier si activé
    this.writeToFile(entry);
  }

  /**
   * Logger un message de niveau DEBUG
   * @param message Message à logger
   * @param context Contexte du log
   * @param data Données additionnelles
   * @param userId ID de l'utilisateur associé
   * @param ip Adresse IP de l'utilisateur
   */
  public debug(
    message: string,
    context?: string,
    data?: any,
    userId?: number,
    ip?: string
  ): void {
    this.log(LogLevel.DEBUG, message, context, data, userId, ip);
  }

  /**
   * Logger un message de niveau INFO
   * @param message Message à logger
   * @param context Contexte du log
   * @param data Données additionnelles
   * @param userId ID de l'utilisateur associé
   * @param ip Adresse IP de l'utilisateur
   */
  public info(
    message: string,
    context?: string,
    data?: any,
    userId?: number,
    ip?: string
  ): void {
    this.log(LogLevel.INFO, message, context, data, userId, ip);
  }

  /**
   * Logger un message de niveau WARN
   * @param message Message à logger
   * @param context Contexte du log
   * @param data Données additionnelles
   * @param userId ID de l'utilisateur associé
   * @param ip Adresse IP de l'utilisateur
   */
  public warn(
    message: string,
    context?: string,
    data?: any,
    userId?: number,
    ip?: string
  ): void {
    this.log(LogLevel.WARN, message, context, data, userId, ip);
  }

  /**
   * Logger un message de niveau ERROR
   * @param message Message à logger
   * @param context Contexte du log
   * @param data Données additionnelles
   * @param userId ID de l'utilisateur associé
   * @param ip Adresse IP de l'utilisateur
   */
  public error(
    message: string,
    context?: string,
    data?: any,
    userId?: number,
    ip?: string
  ): void {
    this.log(LogLevel.ERROR, message, context, data, userId, ip);
  }

  /**
   * Logger un message de niveau FATAL
   * @param message Message à logger
   * @param context Contexte du log
   * @param data Données additionnelles
   * @param userId ID de l'utilisateur associé
   * @param ip Adresse IP de l'utilisateur
   */
  public fatal(
    message: string,
    context?: string,
    data?: any,
    userId?: number,
    ip?: string
  ): void {
    this.log(LogLevel.FATAL, message, context, data, userId, ip);
  }

  /**
   * Enregistrer une exception
   * @param error Erreur à logger
   * @param context Contexte de l'erreur
   * @param userId ID de l'utilisateur associé
   * @param ip Adresse IP de l'utilisateur
   */
  public exception(
    error: Error | any,
    context?: string,
    userId?: number,
    ip?: string
  ): void {
    const message = error.message || "An error occurred";
    const stack = error.stack || "";

    this.error(`Exception: ${message}`, context, { stack }, userId, ip);
  }

  /**
   * Fermer le logger proprement
   */
  public close(): void {
    if (this.writeStream) {
      this.writeStream.end();
      this.writeStream = null;
    }
  }
}

// Export d'une instance singleton
const Logger = LoggingService.getInstance();
export default Logger;
