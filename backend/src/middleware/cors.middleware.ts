// backend/src/middleware/cors.middleware.ts

import cors from "cors";

// Configuration CORS plus complète
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Récupérer les origines autorisées depuis la variable d'environnement
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:3000"];

    // Permettre les requêtes sans origine (comme les appels API directs)
    if (!origin) {
      return callback(null, true);
    }

    // Vérifier si l'origine est autorisée
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
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
};

export default cors(corsOptions);
