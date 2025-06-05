// frontend/src/lib/api-client.ts
import { toast } from "sonner";

// Configuration de base
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Types pour les réponses API
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[];
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

// Client API singleton
class ApiClient {
  private static instance: ApiClient;
  private token: string | null = null;

  private constructor() {
    // Récupérer le token du localStorage au démarrage
    this.token = localStorage.getItem("isra_auth_token");
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Setter pour le token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("isra_auth_token", token);
    } else {
      localStorage.removeItem("isra_auth_token");
    }
  }

  // Méthode générique pour les requêtes
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Ajouter le token si disponible
    if (this.token) {
      defaultHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error("Session expirée");
      }

      // Si la réponse n'est pas OK, lancer une erreur
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erreur API");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        throw error;
      }
      throw new Error("Erreur réseau");
    }
  }

  // Gérer la déconnexion automatique
  private handleUnauthorized() {
    this.setToken(null);
    localStorage.removeItem("isra_user");
    window.location.href = "/login";
  }

  // Méthodes HTTP
  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Export de l'instance
export const apiClient = ApiClient.getInstance();

// Export des types
export type { ApiResponse };
