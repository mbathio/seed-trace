// backend/src/middleware/upload.middleware.ts

import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { ValidationError } from "../types/errors";
import { v4 as uuidv4 } from "uuid";

// Créer le répertoire de téléchargement s'il n'existe pas
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurer le stockage pour multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique en préservant l'extension
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Filtre pour les types de fichiers acceptés
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accepter uniquement les images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        "Type de fichier non supporté. Seules les images sont acceptées."
      )
    );
  }
};

// Configuration pour les images
const imageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5 Mo
  },
});

// Configuration pour les fichiers CSV
const csvFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accepter les fichiers CSV
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    (file.originalname.endsWith(".csv") &&
      file.mimetype === "application/octet-stream")
  ) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        "Type de fichier non supporté. Seuls les fichiers CSV sont acceptés."
      )
    );
  }
};

const csvUpload = multer({
  storage,
  fileFilter: csvFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite à 10 Mo
  },
});

// Middleware pour télécharger une seule image QR
export const uploadQRImage = imageUpload.single("qrImage");

// Middleware pour télécharger plusieurs images
export const uploadImages = imageUpload.array("images", 10); // Max 10 images

// Middleware pour télécharger un fichier CSV
export const uploadCSV = csvUpload.single("csvFile");

export default {
  uploadQRImage,
  uploadImages,
  uploadCSV,
};
