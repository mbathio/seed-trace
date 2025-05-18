// backend/src/middleware/requestLogger.middleware.ts

import { Request, Response, NextFunction } from "express";
import Logger from "../services/logging.service";

/**
 * Middleware pour logger les requêtes détaillées
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Timestamp de début de la requête
  const start = Date.now();

  // Données de base de la requête
  const requestData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    userId: req.user?.id,
  };

  // Logger l'événement de début de requête
  Logger.debug(
    `${req.method} ${req.originalUrl} - Request started`,
    "RequestLogger",
    requestData,
    req.user?.id,
    req.ip
  );

  // Capturer les données de réponse
  const originalEnd = res.end;
  const originalWrite = res.write;
  const chunks: Buffer[] = [];

  // Surcharger res.write pour capturer le corps de la réponse
  // @ts-ignore
  res.write = function (chunk: Buffer): boolean {
    chunks.push(Buffer.from(chunk));
    // @ts-ignore
    return originalWrite.apply(res, arguments);
  };

  // Surcharger res.end pour logger la fin de la requête
  // @ts-ignore
  res.end = function (): any {
    const duration = Date.now() - start;

    // Restaurer la fonction originale
    res.write = originalWrite;
    res.end = originalEnd;

    // Données de fin de requête
    const responseData = {
      ...requestData,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.getHeader("content-length"),
      contentType: res.getHeader("content-type"),
    };

    // Logger selon le statut de la réponse
    if (res.statusCode >= 500) {
      Logger.error(
        `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
        "RequestLogger",
        responseData,
        req.user?.id,
        req.ip
      );
    } else if (res.statusCode >= 400) {
      Logger.warn(
        `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
        "RequestLogger",
        responseData,
        req.user?.id,
        req.ip
      );
    } else {
      Logger.info(
        `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
        "RequestLogger",
        responseData,
        req.user?.id,
        req.ip
      );
    }

    // Appeler la fonction originale
    // @ts-ignore
    return originalEnd.apply(res, arguments);
  };

  next();
};

export default requestLogger;
