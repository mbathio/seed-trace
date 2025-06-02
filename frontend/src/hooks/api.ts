// frontend/src/hooks/api.ts - Version corrigée avec cohérence backend

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

// Import des types corrigés
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
  ApiResponse,
  PaginationParams,
  SeedLotParams,
  QualityControlParams,
  MultiplierParams,
  ParcelParams,
  ProductionParams,
  CreateSeedLotData,
  UpdateSeedLotData,
  CreateQualityControlData,
  convertUserRoleFromBackend,
  convertStatusFromBackend,
} from "@/utils/seedTypes";

// Interface AuthResponse mise à jour
interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string; // Backend envoie string, on convertit côté frontend
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

// Auth hooks avec conversion des types
export const useLogin = () => {
  return useMutation<ApiResponse<AuthResponse>, Error, LoginCredentials>({
    mutationFn: ({ email, password }) =>
      authAPI.login(email, password).then((res) => res.data),
    onSuccess: (response) => {
      const { user, tokens } = response.data;

      // Meilleure gestion de la conversion des rôles
      const convertedUser = {
        ...user,
        role: convertUserRoleFromBackend(user.role),
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "isra_user",
        JSON.stringify({ ...convertedUser, token: tokens.accessToken })
      );
      toast.success("Connexion réussie");
    },
    onError: (error: Error) => {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur de connexion");
    },
  });
};

export const useCurrentUser = () => {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["currentUser"],
    queryFn: () =>
      authAPI.getCurrentUser().then((res) => {
        // Conversion du rôle si nécessaire
        const userData = res.data.data;
        if (typeof userData.role === "string") {
          userData.role = convertUserRoleFromBackend(userData.role);
        }
        return res.data;
      }),
    enabled: !!localStorage.getItem("isra_user"),
    retry: false,
  });
};

// Seed Lots hooks avec conversion des données
export const useSeedLots = (params?: SeedLotParams) => {
  return useQuery<ApiResponse<SeedLot[]>, Error>({
    queryKey: ["seedLots", params],
    queryFn: () =>
      seedLotsAPI.getAll(params).then((res) => {
        // Conversion des statuts et autres données si nécessaire
        const lots = res.data.data.map((lot) => ({
          ...lot,
          status:
            typeof lot.status === "string"
              ? convertStatusFromBackend(lot.status)
              : lot.status,
        }));

        return {
          ...res.data,
          data: lots,
        };
      }),
  });
};

export const useSeedLot = (id: string) => {
  return useQuery<ApiResponse<SeedLot>, Error>({
    queryKey: ["seedLot", id],
    queryFn: () =>
      seedLotsAPI.getById(id).then((res) => {
        // Conversion des données si nécessaire
        const lot = res.data.data;
        if (typeof lot.status === "string") {
          lot.status = convertStatusFromBackend(lot.status);
        }

        return res.data;
      }),
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
    mutationFn: (data) => {
      // Validation et transformation des données avant envoi
      const validatedData = {
        ...data,
        varietyId: Number(data.varietyId), // S'assurer que c'est un number
        level: data.level.toUpperCase() as SeedLevel, // S'assurer du format
      };

      return seedLotsAPI.create(validatedData).then((res) => res.data);
    },
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
      queryClient.invalidateQueries({ queryKey: ["seedLot"] });
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
      queryClient.invalidateQueries({ queryKey: ["seedLots"] });
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
    mutationFn: (data) => {
      // Adaptation des données pour le backend
      const adaptedData = {
        ...data,
        // Le backend attend latitude/longitude séparément
        latitude: data.latitude,
        longitude: data.longitude,
      };

      return parcelsAPI.create(adaptedData).then((res) => res.data);
    },
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
export const useVarieties = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  cropType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
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
export const useReports = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
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
export const useUsers = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery<ApiResponse<User[]>, Error>({
    queryKey: ["users", params],
    queryFn: () =>
      usersAPI.getAll(params).then((res) => {
        // Conversion des rôles pour tous les utilisateurs
        const users = res.data.data.map((user) => ({
          ...user,
          role:
            typeof user.role === "string"
              ? convertUserRoleFromBackend(user.role)
              : user.role,
        }));

        return {
          ...res.data,
          data: users,
        };
      }),
  });
};

export const useUser = (id: number) => {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["user", id],
    queryFn: () =>
      usersAPI.getById(id).then((res) => {
        // Conversion du rôle utilisateur
        const userData = res.data.data;
        if (typeof userData.role === "string") {
          userData.role = convertUserRoleFromBackend(userData.role);
        }
        return res.data;
      }),
    enabled: !!id,
  });
};

// Hook pour les statistiques du dashboard
export const useDashboardStats = () => {
  return useQuery<ApiResponse<unknown>, Error>({
    queryKey: ["dashboardStats"],
    queryFn: () =>
      fetch("/api/statistics/dashboard", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("isra_user") || "{}").token
          }`,
        },
      }).then((res) => res.json()),
  });
};

// Hook pour les tendances mensuelles
export const useMonthlyTrends = (months: number = 12) => {
  return useQuery<ApiResponse<unknown>, Error>({
    queryKey: ["monthlyTrends", months],
    queryFn: () =>
      fetch(`/api/statistics/trends?months=${months}`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("isra_user") || "{}").token
          }`,
        },
      }).then((res) => res.json()),
  });
};
