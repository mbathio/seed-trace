// backend/src/middleware/validation.middleware.ts

import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../types/errors";
import Logger from "../services/logging.service";

interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: "string" | "number" | "boolean" | "object" | "array" | "date";
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | string;
  };
}

interface ValidationOptions {
  source?: "body" | "query" | "params";
  abortEarly?: boolean;
}

/**
 * Middleware de validation des données de requête
 * @param schema Schéma de validation
 * @param options Options de validation
 */
export const validate = (
  schema: ValidationSchema,
  options: ValidationOptions = { source: "body", abortEarly: true }
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const source = options.source || "body";
      const data = req[source];
      const errors: { field: string; message: string }[] = [];

      // Vérifier chaque champ dans le schéma
      for (const [field, rules] of Object.entries(schema)) {
        // Vérifier si le champ est requis
        const value = data[field];
        if (
          rules.required &&
          (value === undefined || value === null || value === "")
        ) {
          errors.push({ field, message: `Le champ ${field} est requis` });
          if (options.abortEarly) break;
          continue;
        }

        // Si le champ n'est pas présent mais pas requis, passer à la vérification suivante
        if (value === undefined || value === null) continue;

        // Vérifier le type
        if (rules.type) {
          let typeError = false;

          switch (rules.type) {
            case "string":
              typeError = typeof value !== "string";
              break;
            case "number":
              typeError = isNaN(Number(value));
              break;
            case "boolean":
              typeError =
                typeof value !== "boolean" &&
                value !== "true" &&
                value !== "false";
              break;
            case "object":
              typeError =
                typeof value !== "object" ||
                Array.isArray(value) ||
                value === null;
              break;
            case "array":
              typeError = !Array.isArray(value);
              break;
            case "date":
              typeError = isNaN(Date.parse(value));
              break;
          }

          if (typeError) {
            errors.push({
              field,
              message: `Le champ ${field} doit être de type ${rules.type}`,
            });
            if (options.abortEarly) break;
            continue;
          }
        }

        // Vérifier la valeur min/max pour les nombres et les chaînes
        if (rules.min !== undefined) {
          if (
            (rules.type === "number" && Number(value) < rules.min) ||
            (rules.type === "string" && String(value).length < rules.min)
          ) {
            const errorMsg =
              rules.type === "number"
                ? `Le champ ${field} doit être supérieur ou égal à ${rules.min}`
                : `Le champ ${field} doit contenir au moins ${rules.min} caractères`;
            errors.push({ field, message: errorMsg });
            if (options.abortEarly) break;
            continue;
          }
        }

        if (rules.max !== undefined) {
          if (
            (rules.type === "number" && Number(value) > rules.max) ||
            (rules.type === "string" && String(value).length > rules.max)
          ) {
            const errorMsg =
              rules.type === "number"
                ? `Le champ ${field} doit être inférieur ou égal à ${rules.max}`
                : `Le champ ${field} ne doit pas dépasser ${rules.max} caractères`;
            errors.push({ field, message: errorMsg });
            if (options.abortEarly) break;
            continue;
          }
        }

        // Vérifier les motifs (regex)
        if (rules.pattern && !rules.pattern.test(String(value))) {
          errors.push({
            field,
            message: `Le format du champ ${field} est invalide`,
          });
          if (options.abortEarly) break;
          continue;
        }

        // Vérifier les valeurs énumérées
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push({
            field,
            message: `Le champ ${field} doit être l'une des valeurs suivantes: ${rules.enum.join(
              ", "
            )}`,
          });
          if (options.abortEarly) break;
          continue;
        }

        // Validation personnalisée
        if (rules.custom) {
          const result = rules.custom(value);
          if (result !== true) {
            const errorMessage =
              typeof result === "string"
                ? result
                : `Le champ ${field} est invalide`;
            errors.push({ field, message: errorMessage });
            if (options.abortEarly) break;
            continue;
          }
        }
      }

      // S'il y a des erreurs, lancer une ValidationError
      if (errors.length > 0) {
        // Loguer les erreurs de validation
        Logger.debug(
          `Validation errors for ${req.method} ${req.path}`,
          "Validation",
          { errors },
          req.user?.id,
          req.ip
        );

        if (options.abortEarly) {
          throw new ValidationError(errors[0].message, errors[0].field);
        } else {
          throw new ValidationError("Validation échouée", undefined, errors);
        }
      }

      // Tout va bien, passer à l'étape suivante
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Schémas de validation prédéfinis
export const emailSchema = {
  type: "string",
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export const passwordSchema = {
  type: "string",
  min: 8,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

export const idSchema = {
  type: "number",
  min: 1,
  custom: (value: any) =>
    Number.isInteger(Number(value)) ||
    "L'identifiant doit être un entier positif",
};
