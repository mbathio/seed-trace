// frontend/src/lib/api.ts - Version corrigée avec toutes les fonctions nécessaires

import axios, { AxiosResponse } from "axios";
import {
  SeedLot,
  QualityControl,
  Multiplier,
  Parcel,
  Production,
  Variety,
  User,
  UserRole,
  SeedLevel,
  SeedLotStatus,
  ApiResponse,
  convertStatusToBackend,
  convertUserRoleToBackend,
} from "@/utils/seedTypes";

const API_BASE_URL = "http://localhost:3001/api";

// Configuration du client Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types pour l'authentification
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string; // Backend envoie string lowercase
  };
  tokens: AuthTokens;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

// Fonctions utilitaires pour la conversion des données
const convertUserRoleFromBackend = (backendRole: string): UserRole => {
  const normalizedRole = backendRole.toUpperCase();
  const roleMap: Record<string, UserRole> = {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    INSPECTOR: "INSPECTOR",
    MULTIPLIER: "MULTIPLIER",
    GUEST: "GUEST",
    TECHNICIAN: "TECHNICIAN",
    RESEARCHER: "RESEARCHER",
  };

  return roleMap[normalizedRole] || "GUEST";
};

const convertStatusFromBackend = (backendStatus: string): SeedLotStatus => {
  const normalizedStatus = backendStatus.toUpperCase();
  const statusMap: Record<string, SeedLotStatus> = {
    PENDING: "PENDING",
    CERTIFIED: "CERTIFIED",
    REJECTED: "REJECTED",
    IN_STOCK: "IN_STOCK",
    SOLD: "SOLD",
    ACTIVE: "ACTIVE",
    DISTRIBUTED: "DISTRIBUTED",
  };

  return statusMap[normalizedStatus] || "PENDING";
};

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("isra_user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
        localStorage.removeItem("isra_user");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => {
    // Transformation des données si nécessaire
    if (response.data && response.data.data) {
      // Conversion des données depuis le backend
      if (Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map((item) =>
          transformItemFromBackend(item)
        );
      } else {
        response.data.data = transformItemFromBackend(response.data.data);
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("isra_user");
      window.location.href = "/login";
    }

    // Gestion des erreurs avec messages plus spécifiques
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Erreur de communication avec le serveur");
  }
);

function transformItemFromBackend(
  item: Record<string, unknown>
): Record<string, unknown> {
  if (!item || typeof item !== "object") return item;

  // Conversion des rôles utilisateurs
  if (item.role && typeof item.role === "string") {
    item.role = convertUserRoleFromBackend(item.role);
  }

  // Conversion des statuts de lots
  if (item.status && typeof item.status === "string") {
    item.status = convertStatusFromBackend(item.status);
  }

  // Conversion des dates si nécessaire
  const dateFields = [
    "createdAt",
    "updatedAt",
    "productionDate",
    "expiryDate",
    "controlDate",
    "startDate",
    "endDate",
  ];

  for (const [key, value] of Object.entries(item)) {
    if (dateFields.includes(key) && typeof value === "string") {
      // Garder comme string pour cohérence avec le backend
      item[key] = value;
    } else if (typeof value === "object" && value !== null) {
      item[key] = transformItemFromBackend(value as Record<string, unknown>);
    }
  }

  return item;
}

// Services API avec adaptation des données
export const authAPI = {
  login: (
    email: string,
    password: string
  ): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    apiClient.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    } as LoginRequest),

  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.get<ApiResponse<User>>("/auth/me"),

  refreshToken: (
    refreshToken: string
  ): Promise<AxiosResponse<ApiResponse<AuthTokens>>> =>
    apiClient.post<ApiResponse<AuthTokens>>("/auth/refresh", {
      refreshToken,
    } as RefreshTokenRequest),
};

// Types pour les seed lots
interface SeedLotParams {
  page?: number;
  pageSize?: number;
  search?: string;
  level?: SeedLevel;
  status?: SeedLotStatus;
  varietyId?: number; // Corrigé: number au lieu de string
  multiplierId?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface CreateSeedLotData {
  varietyId: number; // Corrigé: number au lieu de string
  level: SeedLevel;
  quantity: number;
  productionDate: string;
  multiplierId?: number;
  parcelId?: number;
  parentLotId?: string;
  notes?: string;
}

interface UpdateSeedLotData {
  quantity?: number;
  status?: SeedLotStatus;
  notes?: string;
  expiryDate?: string;
}

export const seedLotsAPI = {
  getAll: (
    params?: SeedLotParams
  ): Promise<AxiosResponse<ApiResponse<SeedLot[]>>> => {
    // Conversion des paramètres pour le backend
    const backendParams = params
      ? {
          ...params,
          status: params.status
            ? convertStatusToBackend(params.status)
            : undefined,
        }
      : undefined;

    return apiClient.get<ApiResponse<SeedLot[]>>("/seed-lots", {
      params: backendParams,
    });
  },

  getById: (id: string): Promise<AxiosResponse<ApiResponse<SeedLot>>> =>
    apiClient.get<ApiResponse<SeedLot>>(`/seed-lots/${id}`),

  create: (
    data: CreateSeedLotData
  ): Promise<AxiosResponse<ApiResponse<SeedLot>>> => {
    // Adaptation des données pour le backend
    const backendData = {
      ...data,
      varietyId: Number(data.varietyId), // S'assurer que c'est un number
      level: data.level.toUpperCase(), // S'assurer du format majuscule
    };

    return apiClient.post<ApiResponse<SeedLot>>("/seed-lots", backendData);
  },

  update: (
    id: string,
    data: UpdateSeedLotData
  ): Promise<AxiosResponse<ApiResponse<SeedLot>>> => {
    // Conversion du statut si nécessaire
    const backendData = {
      ...data,
      status: data.status ? convertStatusToBackend(data.status) : undefined,
    };

    return apiClient.put<ApiResponse<SeedLot>>(`/seed-lots/${id}`, backendData);
  },

  delete: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete<ApiResponse<null>>(`/seed-lots/${id}`),

  getGenealogy: (
    id: string
  ): Promise<
    AxiosResponse<
      ApiResponse<{
        currentLot: SeedLot;
        ancestors: SeedLot[];
        descendants: SeedLot[];
      }>
    >
  > =>
    apiClient.get<
      ApiResponse<{
        currentLot: SeedLot;
        ancestors: SeedLot[];
        descendants: SeedLot[];
      }>
    >(`/seed-lots/${id}/genealogy`),

  getQRCode: (
    id: string
  ): Promise<AxiosResponse<ApiResponse<{ qrCode: string }>>> =>
    apiClient.get<ApiResponse<{ qrCode: string }>>(`/seed-lots/${id}/qr-code`),
};

// Types pour les contrôles qualité
interface QualityControlParams {
  page?: number;
  pageSize?: number;
  search?: string;
  result?: string;
  lotId?: string;
  inspectorId?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface CreateQualityControlData {
  lotId: string;
  controlDate: string;
  germinationRate: number;
  varietyPurity: number;
  moistureContent?: number;
  seedHealth?: number;
  observations?: string;
  testMethod?: string;
}

export const qualityControlsAPI = {
  getAll: (
    params?: QualityControlParams
  ): Promise<AxiosResponse<ApiResponse<QualityControl[]>>> =>
    apiClient.get<ApiResponse<QualityControl[]>>("/quality-controls", {
      params,
    }),

  create: (
    data: CreateQualityControlData
  ): Promise<AxiosResponse<ApiResponse<QualityControl>>> =>
    apiClient.post<ApiResponse<QualityControl>>("/quality-controls", data),

  update: (
    id: number,
    data: Partial<CreateQualityControlData>
  ): Promise<AxiosResponse<ApiResponse<QualityControl>>> =>
    apiClient.put<ApiResponse<QualityControl>>(`/quality-controls/${id}`, data),
};

// Types pour les multiplicateurs
interface MultiplierParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  certificationLevel?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const multipliersAPI = {
  getAll: (
    params?: MultiplierParams
  ): Promise<AxiosResponse<ApiResponse<Multiplier[]>>> =>
    apiClient.get<ApiResponse<Multiplier[]>>("/multipliers", { params }),

  getById: (id: number): Promise<AxiosResponse<ApiResponse<Multiplier>>> =>
    apiClient.get<ApiResponse<Multiplier>>(`/multipliers/${id}`),

  create: (
    data: Partial<Multiplier>
  ): Promise<AxiosResponse<ApiResponse<Multiplier>>> => {
    // Adaptation des données pour le backend
    const backendData = {
      ...data,
      // Le backend attend des champs séparés pour les coordonnées
      latitude: data.latitude,
      longitude: data.longitude,
    };

    return apiClient.post<ApiResponse<Multiplier>>("/multipliers", backendData);
  },

  update: (
    id: number,
    data: Partial<Multiplier>
  ): Promise<AxiosResponse<ApiResponse<Multiplier>>> => {
    const backendData = {
      ...data,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    return apiClient.put<ApiResponse<Multiplier>>(
      `/multipliers/${id}`,
      backendData
    );
  },
};

// Types pour les parcelles
interface ParcelParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  multiplierId?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const parcelsAPI = {
  getAll: (
    params?: ParcelParams
  ): Promise<AxiosResponse<ApiResponse<Parcel[]>>> =>
    apiClient.get<ApiResponse<Parcel[]>>("/parcels", { params }),

  getById: (id: number): Promise<AxiosResponse<ApiResponse<Parcel>>> =>
    apiClient.get<ApiResponse<Parcel>>(`/parcels/${id}`),

  create: (
    data: Partial<Parcel>
  ): Promise<AxiosResponse<ApiResponse<Parcel>>> => {
    // Le backend attend latitude/longitude séparément
    const backendData = {
      ...data,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    return apiClient.post<ApiResponse<Parcel>>("/parcels", backendData);
  },

  update: (
    id: number,
    data: Partial<Parcel>
  ): Promise<AxiosResponse<ApiResponse<Parcel>>> => {
    const backendData = {
      ...data,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    return apiClient.put<ApiResponse<Parcel>>(`/parcels/${id}`, backendData);
  },

  addSoilAnalysis: (
    id: number,
    data: {
      analysisDate: string;
      pH?: number;
      organicMatter?: number;
      nitrogen?: number;
      phosphorus?: number;
      potassium?: number;
      notes?: string;
    }
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.post<ApiResponse<unknown>>(`/parcels/${id}/soil-analysis`, data),
};

// Types pour les productions
interface ProductionParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  multiplierId?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const productionsAPI = {
  getAll: (
    params?: ProductionParams
  ): Promise<AxiosResponse<ApiResponse<Production[]>>> =>
    apiClient.get<ApiResponse<Production[]>>("/productions", { params }),

  getById: (id: number): Promise<AxiosResponse<ApiResponse<Production>>> =>
    apiClient.get<ApiResponse<Production>>(`/productions/${id}`),

  create: (
    data: Partial<Production>
  ): Promise<AxiosResponse<ApiResponse<Production>>> =>
    apiClient.post<ApiResponse<Production>>("/productions", data),

  update: (
    id: number,
    data: Partial<Production>
  ): Promise<AxiosResponse<ApiResponse<Production>>> =>
    apiClient.put<ApiResponse<Production>>(`/productions/${id}`, data),

  addActivity: (
    id: number,
    data: {
      type: string;
      activityDate: string;
      description: string;
      personnel?: string[];
      notes?: string;
      inputs?: Array<{
        name: string;
        quantity: string;
        unit: string;
        cost?: number;
      }>;
    }
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.post<ApiResponse<unknown>>(`/productions/${id}/activities`, data),

  addIssue: (
    id: number,
    data: {
      issueDate: string;
      type: string;
      description: string;
      severity: string;
      actions: string;
      cost?: number;
    }
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.post<ApiResponse<unknown>>(`/productions/${id}/issues`, data),

  addWeatherData: (
    id: number,
    data: {
      recordDate: string;
      temperature: number;
      rainfall: number;
      humidity: number;
      windSpeed?: number;
      notes?: string;
      source?: string;
    }
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.post<ApiResponse<unknown>>(
      `/productions/${id}/weather-data`,
      data
    ),
};

// API pour les rapports
export const reportsAPI = {
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    type?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
    apiClient.get<ApiResponse<unknown[]>>("/reports", { params }),

  getProduction: (
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.get<ApiResponse<unknown>>("/reports/production", { params }),

  getQuality: (
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.get<ApiResponse<unknown>>("/reports/quality", { params }),

  getInventory: (
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.get<ApiResponse<unknown>>("/reports/inventory", { params }),

  getMultiplierPerformance: (
    params?: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.get<ApiResponse<unknown>>("/reports/multiplier-performance", {
      params,
    }),
};

// API pour les variétés
interface VarietyParams {
  page?: number;
  pageSize?: number;
  search?: string;
  cropType?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const varietiesAPI = {
  getAll: (
    params?: VarietyParams
  ): Promise<AxiosResponse<ApiResponse<Variety[]>>> =>
    apiClient.get<ApiResponse<Variety[]>>("/varieties", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Variety>>> =>
    apiClient.get<ApiResponse<Variety>>(`/varieties/${id}`),

  create: (
    data: Partial<Variety>
  ): Promise<AxiosResponse<ApiResponse<Variety>>> =>
    apiClient.post<ApiResponse<Variety>>("/varieties", data),

  update: (
    id: string,
    data: Partial<Variety>
  ): Promise<AxiosResponse<ApiResponse<Variety>>> =>
    apiClient.put<ApiResponse<Variety>>(`/varieties/${id}`, data),
};

// API pour les utilisateurs
interface UserParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export const usersAPI = {
  getAll: (
    params?: UserParams
  ): Promise<AxiosResponse<ApiResponse<User[]>>> => {
    // Conversion du rôle pour le backend si nécessaire
    const backendParams = params
      ? {
          ...params,
          role:
            params.role && typeof params.role === "string"
              ? convertUserRoleToBackend(params.role as UserRole)
              : params.role,
        }
      : undefined;

    return apiClient.get<ApiResponse<User[]>>("/users", {
      params: backendParams,
    });
  },

  getById: (id: number): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> => {
    // Conversion du rôle pour le backend
    const backendData = {
      ...data,
      role: data.role ? convertUserRoleToBackend(data.role) : undefined,
    };

    return apiClient.post<ApiResponse<User>>("/users", backendData);
  },

  update: (
    id: number,
    data: Partial<User>
  ): Promise<AxiosResponse<ApiResponse<User>>> => {
    const backendData = {
      ...data,
      role: data.role ? convertUserRoleToBackend(data.role) : undefined,
    };

    return apiClient.put<ApiResponse<User>>(`/users/${id}`, backendData);
  },

  updatePassword: (
    id: number,
    data: {
      currentPassword: string;
      newPassword: string;
    }
  ): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.put<ApiResponse<null>>(`/users/${id}/password`, data),
};

// API pour les statistiques
export const statisticsAPI = {
  getDashboard: (): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.get<ApiResponse<unknown>>("/statistics/dashboard"),

  getTrends: (months?: number): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.get<ApiResponse<unknown>>(
      `/statistics/trends?months=${months || 12}`
    ),
};

// API pour l'export
export const exportAPI = {
  seedLots: (params?: {
    format?: "csv" | "json";
    level?: SeedLevel;
    status?: SeedLotStatus;
    varietyId?: number;
    multiplierId?: number;
  }): Promise<AxiosResponse<string | ApiResponse<unknown>>> => {
    const backendParams = params
      ? {
          ...params,
          status: params.status
            ? convertStatusToBackend(params.status)
            : undefined,
        }
      : undefined;

    return apiClient.get("/export/seed-lots", {
      params: backendParams,
      responseType: params?.format === "csv" ? "text" : "json",
    });
  },

  qualityReport: (params?: {
    format?: "html" | "json";
    startDate?: string;
    endDate?: string;
    result?: string;
    varietyId?: number;
  }): Promise<AxiosResponse<string | ApiResponse<unknown>>> =>
    apiClient.get("/export/quality-report", {
      params,
      responseType: params?.format === "html" ? "text" : "json",
    }),
};
