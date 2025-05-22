// backend/src/utils/encryption.ts
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

  static generateTokens(payload: JwtPayload): AuthTokens {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
    });

    const refreshToken = jwt.sign(
      { userId: payload.userId },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshTokenExpiry }
    );

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  }

  static generateLotId(level: string, year?: number): string {
    const currentYear = year || new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `SL-${level}-${currentYear}-${randomNum}`;
  }
}
