// backend/src/middleware/cacheControl.middleware.ts

import { Request, Response, NextFunction } from "express";

// Types pour les options de cache
type CacheDuration = "no-cache" | "short" | "medium" | "long" | "very-long";

interface CacheOptions {
  duration: CacheDuration;
  private?: boolean;
  immutable?: boolean;
}

/**
 * Middleware pour configurer le contrôle de cache
 * @param options Options de cache
 */
export const cacheControl = (options: CacheOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Déterminer la durée en secondes
    let maxAge: number;

    switch (options.duration) {
      case "no-cache":
        maxAge = 0;
        break;
      case "short":
        maxAge = 60; // 1 minute
        break;
      case "medium":
        maxAge = 300; // 5 minutes
        break;
      case "long":
        maxAge = 3600; // 1 heure
        break;
      case "very-long":
        maxAge = 86400; // 1 jour
        break;
      default:
        maxAge = 0;
    }

    // Construire la directive de cache
    let cacheDirective = options.private ? "private" : "public";

    if (options.duration === "no-cache") {
      cacheDirective = "no-cache, no-store, must-revalidate";
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else {
      cacheDirective += `, max-age=${maxAge}`;

      if (options.immutable) {
        cacheDirective += ", immutable";
      }
    }

    // Appliquer l'en-tête Cache-Control
    res.setHeader("Cache-Control", cacheDirective);

    next();
  };
};

// Middleware pour les routes d'API sans cache
export const noCache = cacheControl({ duration: "no-cache" });

// Middleware pour les ressources statiques avec cache long
export const staticCache = cacheControl({
  duration: "very-long",
  immutable: true,
});

// Middleware pour les données qui changent peu souvent
export const dataCache = cacheControl({
  duration: "medium",
});

export default {
  cacheControl,
  noCache,
  staticCache,
  dataCache,
};
