// backend/src/utils/encryption.ts (solution alternative si la première ne marche pas)
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/environment";
import { JwtPayload, AuthTokens } from "../types/api";

export class EncryptionService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.bcrypt.saltRounds);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // ✅ Fonction utilitaire pour convertir les durées string en secondes
  private static parseExpiresIn(duration: string): number {
    const units: { [key: string]: number } = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
      w: 604800,
      y: 31536000,
    };

    const match = duration.match(/^(\d+)([smhdwy])$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const [, amount, unit] = match;
    return parseInt(amount) * (units[unit] || 1);
  }

  static generateTokens(payload: JwtPayload): AuthTokens {
    const secret = config.jwt.secret;

    if (!secret || typeof secret !== "string") {
      throw new Error("JWT_SECRET must be a valid string");
    }

    // ✅ Option 1: Utiliser les durées en secondes
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: this.parseExpiresIn(config.jwt.accessTokenExpiry), // Convertit "15m" en 900 secondes
    });

    const refreshToken = jwt.sign({ userId: payload.userId }, secret, {
      expiresIn: this.parseExpiresIn(config.jwt.refreshTokenExpiry), // Convertit "7d" en 604800 secondes
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): JwtPayload {
    const secret = config.jwt.secret;

    if (!secret || typeof secret !== "string") {
      throw new Error("JWT_SECRET must be a valid string");
    }

    return jwt.verify(token, secret) as JwtPayload;
  }

  static generateLotId(level: string, year?: number): string {
    const currentYear = year || new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `SL-${level}-${currentYear}-${randomNum}`;
  }
}
