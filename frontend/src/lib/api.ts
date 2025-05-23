// frontend/src/lib/api.ts - Version avec typage strict
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Types pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

// Configuration du client Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types pour l'authentification
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

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
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem("isra_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Services API avec typage strict
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
  level?: string;
  status?: string;
  varietyId?: string;
  multiplierId?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface CreateSeedLotData {
  varietyId: string;
  level: string;
  quantity: number;
  productionDate: string;
  multiplierId?: number;
  parcelId?: number;
  parentLotId?: string;
  notes?: string;
}

interface UpdateSeedLotData {
  quantity?: number;
  status?: string;
  notes?: string;
  expiryDate?: string;
}

interface SeedLot {
  id: string;
  varietyId: string;
  level: string;
  quantity: number;
  productionDate: string;
  status: string;
  // ... autres propriétés
}

export const seedLotsAPI = {
  getAll: (
    params?: SeedLotParams
  ): Promise<AxiosResponse<ApiResponse<SeedLot[]>>> =>
    apiClient.get<ApiResponse<SeedLot[]>>("/seed-lots", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<SeedLot>>> =>
    apiClient.get<ApiResponse<SeedLot>>(`/seed-lots/${id}`),

  create: (
    data: CreateSeedLotData
  ): Promise<AxiosResponse<ApiResponse<SeedLot>>> =>
    apiClient.post<ApiResponse<SeedLot>>("/seed-lots", data),

  update: (
    id: string,
    data: UpdateSeedLotData
  ): Promise<AxiosResponse<ApiResponse<SeedLot>>> =>
    apiClient.put<ApiResponse<SeedLot>>(`/seed-lots/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    apiClient.delete<ApiResponse<null>>(`/seed-lots/${id}`),

  getGenealogy: (id: string): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.get<ApiResponse<unknown>>(`/seed-lots/${id}/genealogy`),

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

interface QualityControl {
  id: number;
  lotId: string;
  controlDate: string;
  germinationRate: number;
  varietyPurity: number;
  result: string;
  // ... autres propriétés
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

// Types génériques pour les autres entités
interface BaseParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface Multiplier {
  id: number;
  name: string;
  status: string;
  // ... autres propriétés
}

interface MultiplierParams extends BaseParams {
  status?: string;
  certificationLevel?: string;
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
  ): Promise<AxiosResponse<ApiResponse<Multiplier>>> =>
    apiClient.post<ApiResponse<Multiplier>>("/multipliers", data),

  update: (
    id: number,
    data: Partial<Multiplier>
  ): Promise<AxiosResponse<ApiResponse<Multiplier>>> =>
    apiClient.put<ApiResponse<Multiplier>>(`/multipliers/${id}`, data),
};

interface Parcel {
  id: number;
  name?: string;
  area: number;
  status: string;
  // ... autres propriétés
}

interface ParcelParams extends BaseParams {
  status?: string;
  multiplierId?: number;
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
  ): Promise<AxiosResponse<ApiResponse<Parcel>>> =>
    apiClient.post<ApiResponse<Parcel>>("/parcels", data),

  update: (
    id: number,
    data: Partial<Parcel>
  ): Promise<AxiosResponse<ApiResponse<Parcel>>> =>
    apiClient.put<ApiResponse<Parcel>>(`/parcels/${id}`, data),
};

interface Production {
  id: number;
  lotId: string;
  status: string;
  // ... autres propriétés
}

interface ProductionParams extends BaseParams {
  status?: string;
  multiplierId?: number;
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

  addActivity: (
    id: number,
    data: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.post<ApiResponse<unknown>>(`/productions/${id}/activities`, data),

  addIssue: (
    id: number,
    data: Record<string, unknown>
  ): Promise<AxiosResponse<ApiResponse<unknown>>> =>
    apiClient.post<ApiResponse<unknown>>(`/productions/${id}/issues`, data),
};

export const reportsAPI = {
  getAll: (
    params?: BaseParams
  ): Promise<AxiosResponse<ApiResponse<unknown[]>>> =>
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
};

interface Variety {
  id: string;
  name: string;
  cropType: string;
  // ... autres propriétés
}

interface VarietyParams extends BaseParams {
  cropType?: string;
}

export const varietiesAPI = {
  getAll: (
    params?: VarietyParams
  ): Promise<AxiosResponse<ApiResponse<Variety[]>>> =>
    apiClient.get<ApiResponse<Variety[]>>("/varieties", { params }),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<Variety>>> =>
    apiClient.get<ApiResponse<Variety>>(`/varieties/${id}`),
};

interface UserParams extends BaseParams {
  role?: string;
  isActive?: boolean;
}

export const usersAPI = {
  getAll: (params?: UserParams): Promise<AxiosResponse<ApiResponse<User[]>>> =>
    apiClient.get<ApiResponse<User[]>>("/users", { params }),

  getById: (id: number): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.post<ApiResponse<User>>("/users", data),

  update: (
    id: number,
    data: Partial<User>
  ): Promise<AxiosResponse<ApiResponse<User>>> =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),
};
