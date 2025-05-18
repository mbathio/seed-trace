// backend/src/config/auth.ts

import { CorsOptions } from "cors";

interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    issuer: string;
    algorithm: "HS256" | "HS384" | "HS512";
  };
  cors: CorsOptions;
  passwordHash: {
    saltRounds: number;
  };
}

// Charger la configuration d'authentification
const getAuthConfig = (): AuthConfig => {
  // Vérifier que le secret JWT est défini
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // Obtenir les origines CORS autorisées
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : ["http://localhost:3000"];

  return {
    jwt: {
      secret: jwtSecret,
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      issuer: "isra-seeds-api",
      algorithm: "HS256",
    },
    cors: {
      origin: (origin, callback) => {
        // Permettre les requêtes sans origine (comme les appels API directs)
        if (!origin) return callback(null, true);

        // Vérifier si l'origine est autorisée
        if (corsOrigins.indexOf(origin) !== -1 || corsOrigins.includes("*")) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
      optionsSuccessStatus: 200,
      maxAge: 86400, // 24 heures
    },
    passwordHash: {
      saltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS || "10"),
    },
  };
};

export default getAuthConfig;
