// backend/src/middleware/rateLimiter.middleware.ts

import { Request, Response, NextFunction } from "express";
import rateLimit, {
  Options,
  RateLimitRequestHandler,
} from "express-rate-limit";
import Logger from "../services/logging.service";

/**
 * Configuration des limites de taux par défaut
 */
const defaultLimiterOptions: Partial<Options> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par fenêtre
  standardHeaders: true, // Retourner les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactiver les headers `X-RateLimit-*`
  message: {
    status: "error",
    message: "Trop de requêtes, veuillez réessayer plus tard",
    code: "RATE_LIMIT_EXCEEDED",
  },
  handler: (req: Request, res: Response) => {
    Logger.warn(
      `Rate limit exceeded for IP: ${req.ip}`,
      "RateLimit",
      {
        path: req.path,
        method: req.method,
      },
      req.user?.id,
      req.ip
    );

    return res.status(429).json({
      status: "error",
      message: "Trop de requêtes, veuillez réessayer plus tard",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
};

/**
 * Rate limiter standard pour la plupart des routes
 */
export const standardLimiter: RateLimitRequestHandler = rateLimit({
  ...defaultLimiterOptions,
});

/**
 * Rate limiter plus strict pour les routes d'authentification
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  ...defaultLimiterOptions,
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // Limiter chaque IP à 10 tentatives de connexion par heure
  message: {
    status: "error",
    message: "Trop de tentatives de connexion, veuillez réessayer plus tard",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
});

/**
 * Rate limiter pour les routes d'API qui nécessitent beaucoup d'appels
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  ...defaultLimiterOptions,
  max: 1000, // Limiter chaque IP à 1000 requêtes par fenêtre
});

export default {
  standardLimiter,
  authLimiter,
  apiLimiter,
};
