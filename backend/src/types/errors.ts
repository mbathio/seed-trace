// backend/src/types/errors.ts

/**
 * Classe de base pour les erreurs personnalisées de l'application
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
  field?: string;
  errors?: any[];

  /**
   * Constructeur de l'erreur de base
   * @param message Message d'erreur
   * @param statusCode Code HTTP de l'erreur
   * @param isOperational Indique si l'erreur est opérationnelle (attendue/connue)
   * @param errors Erreurs additionnelles (pour la validation)
   * @param code Code d'erreur personnalisé
   * @param field Champ concerné par l'erreur
   */
  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errors: any[] = [],
    code?: string,
    field?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    this.code = code;
    this.field = field;

    // Permettre à instanceof de fonctionner correctement pour les classes dérivées
    Object.setPrototypeOf(this, new.target.prototype);

    // Capturer la stack trace
    Error.captureStackTrace(this, this.constructor);

    // Définir le nom de l'erreur comme le nom de la classe
    this.name = this.constructor.name;
  }
}

/**
 * Erreur de validation de données
 */
export class ValidationError extends AppError {
  constructor(message: string, field?: string, errors: any[] = []) {
    super(message, 400, true, errors, "VALIDATION_ERROR", field);
  }
}

/**
 * Erreur d'authentification (non authentifié)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentification requise") {
    super(message, 401, true, [], "AUTHENTICATION_ERROR");
  }
}

/**
 * Erreur d'autorisation (permissions insuffisantes)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Vous n'avez pas les permissions nécessaires") {
    super(message, 403, true, [], "AUTHORIZATION_ERROR");
  }
}

/**
 * Erreur de ressource non trouvée
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Ressource non trouvée") {
    super(message, 404, true, [], "NOT_FOUND");
  }
}

/**
 * Erreur de conflit (ressource déjà existante)
 */
export class ConflictError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 409, true, [], "CONFLICT", field);
  }
}

/**
 * Erreur liée à la base de données
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Erreur de base de données", code?: string) {
    super(message, 500, false, [], code || "DATABASE_ERROR");
  }
}

/**
 * Erreur liée aux services externes
 */
export class ExternalServiceError extends AppError {
  constructor(message: string, serviceName: string) {
    super(message, 502, false, [], `${serviceName.toUpperCase()}_ERROR`);
  }
}

/**
 * Erreur interne du serveur
 */
export class InternalServerError extends AppError {
  constructor(message: string = "Une erreur interne est survenue") {
    super(message, 500, false, [], "INTERNAL_SERVER_ERROR");
  }
}
