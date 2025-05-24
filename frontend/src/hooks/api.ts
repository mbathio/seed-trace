// frontend/src/hooks/api.ts - Version corrigée avec typage cohérent
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authAPI,
  seedLotsAPI,
  qualityControlsAPI,
  multipliersAPI,
  parcelsAPI,
  productionsAPI,
  reportsAPI,
  varietiesAPI,
  usersAPI,
} from "@/lib/api";
import { toast } from "sonner";

// Importation des types depuis seedTypes.ts pour éviter les conflits
import {
  SeedLot,
  QualityControl,
  Multiplier,
  Parcel,
  Production,
  Variety,
  User,
  SeedLevel,
  SeedLotStatus,
  UserRole,
} from "@/utils/seedTypes";

// Types pour les réponses API - utilisent les types de seedTypes.ts
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

// Interface AuthResponse mise à jour pour utiliser User de seedTypes.ts
interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole; // Utilise UserRole de seedTypes.ts
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Types pour les paramètres de requête
interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface SeedLotParams extends PaginationParams {
  level?: SeedLevel;
  status?: SeedLotStatus;
  varietyId?: string;
  multiplierId?: number;
}

interface QualityControlParams extends PaginationParams {
  result?: "pass" | "fail";
  lotId?: string;
  inspectorId?: number;
}

interface MultiplierParams extends PaginationParams {
  status?: "active" | "inactive";
  certificationLevel?: "beginner" | "intermediate" | "expert";
}

interface ParcelParams extends PaginationParams {
  status?: "available" | "in-use" | "resting";
  multiplierId?: number;
}

interface ProductionParams extends PaginationParams {
  status?: "planned" | "in-progress" | "completed" | "cancelled";
  multiplierId?: number;
}

interface ReportParams extends PaginationParams {
  type?:
    | "production"
    | "quality"
    | "inventory"
    | "multiplier_performance"
    | "custom";
}

interface VarietyParams extends PaginationParams {
  cropType?: string;
}

interface UserParams extends PaginationParams {
  role?: string;
  isActive?: boolean;
}

// Types pour la création/mise à jour
interface CreateSeedLotData {
  varietyId: string;
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

// Auth hooks
export const useLogin = () => {
  return useMutation<ApiResponse<AuthResponse>, Error, LoginCredentials>({
    mutationFn: ({ email, password }) =>
      authAPI.login(email, password).then((res) => res.data),
    onSuccess: (response) => {
      const { user, tokens } = response.data;
      localStorage.setItem(
        "isra_user",
        JSON.stringify({ ...user, token: tokens.accessToken })
      );
      toast.success("Connexion réussie");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur de connexion");
    },
  });
};

export const useCurrentUser = () => {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["currentUser"],
    queryFn: () => authAPI.getCurrentUser().then((res) => res.data),
    enabled: !!localStorage.getItem("isra_user"),
    retry: false,
  });
};

// Seed Lots hooks
export const useSeedLots = (params?: SeedLotParams) => {
  return useQuery<ApiResponse<SeedLot[]>, Error>({
    queryKey: ["seedLots", params],
    queryFn: () => seedLotsAPI.getAll(params).then((res) => res.data),
  });
};

export const useSeedLot = (id: string) => {
  return useQuery<ApiResponse<SeedLot>, Error>({
    queryKey: ["seedLot", id],
    queryFn: () => seedLotsAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useSeedLotGenealogy = (id: string) => {
  return useQuery<
    ApiResponse<{
      currentLot: SeedLot;
      ancestors: SeedLot[];
      descendants: SeedLot[];
    }>,
    Error
  >({
    queryKey: ["seedLotGenealogy", id],
    queryFn: () => seedLotsAPI.getGenealogy(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateSeedLot = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<SeedLot>, Error, CreateSeedLotData>({
    mutationFn: (data) => seedLotsAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedLots"] });
      toast.success("Lot créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
};

export const useUpdateSeedLot = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SeedLot>,
    Error,
    { id: string; data: UpdateSeedLotData }
  >({
    mutationFn: ({ id, data }) =>
      seedLotsAPI.update(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedLots"] });
      toast.success("Lot mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });
};

// Quality Controls hooks
export const useQualityControls = (params?: QualityControlParams) => {
  return useQuery<ApiResponse<QualityControl[]>, Error>({
    queryKey: ["qualityControls", params],
    queryFn: () => qualityControlsAPI.getAll(params).then((res) => res.data),
  });
};

export const useCreateQualityControl = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<QualityControl>,
    Error,
    CreateQualityControlData
  >({
    mutationFn: (data) =>
      qualityControlsAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qualityControls"] });
      toast.success("Contrôle qualité enregistré avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });
};

// Multipliers hooks
export const useMultipliers = (params?: MultiplierParams) => {
  return useQuery<ApiResponse<Multiplier[]>, Error>({
    queryKey: ["multipliers", params],
    queryFn: () => multipliersAPI.getAll(params).then((res) => res.data),
  });
};

export const useMultiplier = (id: number) => {
  return useQuery<ApiResponse<Multiplier>, Error>({
    queryKey: ["multiplier", id],
    queryFn: () => multipliersAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateMultiplier = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Multiplier>, Error, Partial<Multiplier>>({
    mutationFn: (data) => multipliersAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["multipliers"] });
      toast.success("Multiplicateur créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
};

// Parcels hooks
export const useParcels = (params?: ParcelParams) => {
  return useQuery<ApiResponse<Parcel[]>, Error>({
    queryKey: ["parcels", params],
    queryFn: () => parcelsAPI.getAll(params).then((res) => res.data),
  });
};

export const useParcel = (id: number) => {
  return useQuery<ApiResponse<Parcel>, Error>({
    queryKey: ["parcel", id],
    queryFn: () => parcelsAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Parcel>, Error, Partial<Parcel>>({
    mutationFn: (data) => parcelsAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      toast.success("Parcelle créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
};

// Productions hooks
export const useProductions = (params?: ProductionParams) => {
  return useQuery<ApiResponse<Production[]>, Error>({
    queryKey: ["productions", params],
    queryFn: () => productionsAPI.getAll(params).then((res) => res.data),
  });
};

export const useProduction = (id: number) => {
  return useQuery<ApiResponse<Production>, Error>({
    queryKey: ["production", id],
    queryFn: () => productionsAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateProduction = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Production>, Error, Partial<Production>>({
    mutationFn: (data) => productionsAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productions"] });
      toast.success("Production créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
};

// Varieties hooks
export const useVarieties = (params?: VarietyParams) => {
  return useQuery<ApiResponse<Variety[]>, Error>({
    queryKey: ["varieties", params],
    queryFn: () => varietiesAPI.getAll(params).then((res) => res.data),
  });
};

export const useVariety = (id: string) => {
  return useQuery<ApiResponse<Variety>, Error>({
    queryKey: ["variety", id],
    queryFn: () => varietiesAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

// Reports hooks
export const useReports = (params?: ReportParams) => {
  return useQuery<ApiResponse<unknown[]>, Error>({
    queryKey: ["reports", params],
    queryFn: () => reportsAPI.getAll(params).then((res) => res.data),
  });
};

export const useProductionReport = (params?: Record<string, unknown>) => {
  return useQuery<ApiResponse<unknown>, Error>({
    queryKey: ["productionReport", params],
    queryFn: () => reportsAPI.getProduction(params).then((res) => res.data),
    enabled: !!params,
  });
};

export const useQualityReport = (params?: Record<string, unknown>) => {
  return useQuery<ApiResponse<unknown>, Error>({
    queryKey: ["qualityReport", params],
    queryFn: () => reportsAPI.getQuality(params).then((res) => res.data),
    enabled: !!params,
  });
};

// Users hooks
export const useUsers = (params?: UserParams) => {
  return useQuery<ApiResponse<User[]>, Error>({
    queryKey: ["users", params],
    queryFn: () => usersAPI.getAll(params).then((res) => res.data),
  });
};

export const useUser = (id: number) => {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["user", id],
    queryFn: () => usersAPI.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};
