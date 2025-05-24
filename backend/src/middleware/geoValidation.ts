import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../utils/response";

export function validateCoordinates(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const { latitude, longitude } = req.body;

  if (latitude !== undefined || longitude !== undefined) {
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return ResponseHandler.validationError(res, [
        "Coordonnées GPS invalides. Latitude: [-90, 90], Longitude: [-180, 180]",
      ]);
    }

    // Validation spécifique pour le Sénégal
    if (
      latitude < 12.0 ||
      latitude > 16.7 ||
      longitude < -17.6 ||
      longitude > -11.3
    ) {
      console.warn("⚠️ Coordonnées en dehors du Sénégal:", {
        latitude,
        longitude,
      });
    }
  }

  next();
}
