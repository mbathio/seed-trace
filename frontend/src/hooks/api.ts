// frontend/src/hooks/api.ts - Hooks API corrigés avec types explicites

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
  statisticsAPI,
} from "@/lib/api";
import { toast } from "sonner";
import {
  SeedLot,
  QualityControl,
  Multiplier,
  Parcel,
  Production,
  Variety,
  User,
  Report,
  ApiResponse,
  CreateSeedLotData,
  UpdateSeedLotData,
  CreateQualityControlData,
  SeedLotParams,
  QualityControlParams,
  MultiplierParams,
  ParcelParams,
  ProductionParams,
  Role,
  MultiplierHistory,
  Contract,
  SoilAnalysis,
  ProductionActivity,
  ProductionIssue,
  WeatherData,
} from "@/utils/seedTypes";

// ========== TYPES SPÉCIFIQUES ==========

interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface DashboardStats {
  totalLots: number;
  totalProduction: number;
  activeMultipliers: number;
  certificationRate: number;
  monthlyTrends: Array<{
    month: string;
    production: number;
    lots: number;
  }>;
}

interface TrendsData {
  production: Array<{
    month: string;
    quantity: number;
    value: number;
  }>;
  quality: Array<{
    month: string;
    passRate: number;
    totalTests: number;
  }>;
  multipliers: Array<{
    month: string;
    active: number;
    total: number;
  }>;
}

interface ProductionReportData {
  summary: {
    totalProduction: number;
    totalArea: number;
    averageYield: number;
    topVarieties: Array<{
      varietyId: number;
      varietyName: string;
      quantity: number;
    }>;
  };
  byPeriod: Array<{
    period: string;
    production: number;
    area: number;
  }>;
  byMultiplier: Array<{
    multiplierId: number;
    multiplierName: string;
    production: number;
  }>;
}

interface QualityReportData {
  summary: {
    totalTests: number;
    passRate: number;
    averageGermination: number;
    averagePurity: number;
  };
  byLevel: Array<{
    level: string;
    tests: number;
    passRate: number;
  }>;
  trends: Array<{
    date: string;
    passRate: number;
    tests: number;
  }>;
}

interface SoilAnalysisData {
  analysisDate: string;
  pH?: number;
  organicMatter?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  notes?: string;
}

interface ActivityData {
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

interface IssueData {
  issueDate: string;
  type: string;
  description: string;
  severity: string;
  actions: string;
  cost?: number;
}

interface WeatherInputData {
  recordDate: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed?: number;
  notes?: string;
  source?: string;
}

interface ContractData {
  multiplierId: number;
  varietyId: number;
  startDate: string;
  endDate: string;
  seedLevel: SeedLevel; // Changé de string à SeedLevel
  expectedQuantity: number;
  parcelId?: number;
  paymentTerms?: string;
  notes?: string;
  status: string;
}

interface VarietyParams {
  page?: number;
  pageSize?: number;
  search?: string;
  cropType?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface UserParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

interface ReportParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: string;
}

// ========== AUTH HOOKS ==========

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AuthResponse>, Error, LoginCredentials>({
    mutationFn: async ({ email, password }) => {
      const response = await authAPI.login(email, password);
      return response.data;
    },
    onSuccess: (response) => {
      const { user, tokens } = response.data;

      // Sauvegarder les données utilisateur avec tokens
      localStorage.setItem(
        "isra_user",
        JSON.stringify({
          ...user,
          tokens,
          token: tokens.accessToken, // Compatibilité
        })
      );

      // Invalider les queries pour forcer le refresh
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      toast.success("Connexion réussie");
    },
    onError: (error: Error) => {
      console.error("Erreur de connexion:", error);
      toast.error(error.message || "Erreur de connexion");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error>({
    mutationFn: async () => {
      const userData = localStorage.getItem("isra_user");
      if (userData) {
        const { tokens } = JSON.parse(userData);
        if (tokens?.refreshToken) {
          const response = await authAPI.logout(tokens.refreshToken);
          return response.data;
        }
      }
      throw new Error("No refresh token found");
    },
    onSuccess: () => {
      localStorage.removeItem("isra_user");
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: () => {
      // Même en cas d'erreur, on déconnecte localement
      localStorage.removeItem("isra_user");
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};

export const useCurrentUser = () => {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await authAPI.getCurrentUser();
      return response.data;
    },
    enabled: !!localStorage.getItem("isra_user"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ========== SEED LOTS HOOKS ==========

export const useSeedLots = (params?: SeedLotParams) => {
  return useQuery<ApiResponse<SeedLot[]>, Error>({
    queryKey: ["seedLots", params],
    queryFn: async () => {
      const response = await seedLotsAPI.getAll(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSeedLot = (id: string) => {
  return useQuery<ApiResponse<SeedLot>, Error>({
    queryKey: ["seedLot", id],
    queryFn: async () => {
      const response = await seedLotsAPI.getById(id);
      return response.data;
    },
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
    queryFn: async () => {
      const response = await seedLotsAPI.getGenealogy(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateSeedLot = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<SeedLot>, Error, CreateSeedLotData>({
    mutationFn: async (data) => {
      const response = await seedLotsAPI.create(data);
      return response.data;
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
    mutationFn: async ({ id, data }) => {
      const response = await seedLotsAPI.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seedLots"] });
      queryClient.invalidateQueries({ queryKey: ["seedLot", variables.id] });
      toast.success("Lot mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });
};

export const useDeleteSeedLot = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await seedLotsAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seedLots"] });
      toast.success("Lot supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });
};

// ========== QUALITY CONTROLS HOOKS ==========

export const useQualityControls = (params?: QualityControlParams) => {
  return useQuery<ApiResponse<QualityControl[]>, Error>({
    queryKey: ["qualityControls", params],
    queryFn: async () => {
      const response = await qualityControlsAPI.getAll(params);
      return response.data;
    },
  });
};

export const useQualityControl = (id: number) => {
  return useQuery<ApiResponse<QualityControl>, Error>({
    queryKey: ["qualityControl", id],
    queryFn: async () => {
      const response = await qualityControlsAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateQualityControl = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<QualityControl>,
    Error,
    CreateQualityControlData
  >({
    mutationFn: async (data) => {
      const response = await qualityControlsAPI.create(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["qualityControls"] });
      queryClient.invalidateQueries({ queryKey: ["seedLot", variables.lotId] });
      toast.success("Contrôle qualité enregistré avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });
};

// ========== MULTIPLIERS HOOKS ==========

export const useMultipliers = (params?: MultiplierParams) => {
  return useQuery<ApiResponse<Multiplier[]>, Error>({
    queryKey: ["multipliers", params],
    queryFn: async () => {
      const response = await multipliersAPI.getAll(params);
      return response.data;
    },
  });
};

export const useMultiplier = (id: number) => {
  return useQuery<ApiResponse<Multiplier>, Error>({
    queryKey: ["multiplier", id],
    queryFn: async () => {
      const response = await multipliersAPI.getById(id);
      return response.data;
    },
    enabled: !!id && id > 0,
  });
};

export const useCreateMultiplier = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Multiplier>, Error, Partial<Multiplier>>({
    mutationFn: async (data) => {
      const response = await multipliersAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["multipliers"] });
      toast.success("Multiplicateur créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
};

export const useUpdateMultiplier = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Multiplier>,
    Error,
    { id: number; data: Partial<Multiplier> }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await multipliersAPI.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["multipliers"] });
      queryClient.invalidateQueries({ queryKey: ["multiplier", variables.id] });
      toast.success("Multiplicateur mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la mise à jour");
    },
  });
};

export const useCreateMultiplierContract = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Contract>,
    Error,
    {
      multiplierId: number;
      data: ContractData;
    }
  >({
    mutationFn: async ({ multiplierId, data }) => {
      const response = await multipliersAPI.createContract(multiplierId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["multiplier", variables.multiplierId],
      });
      toast.success("Contrat créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création du contrat");
    },
  });
};

// ========== PARCELS HOOKS ==========

export const useParcels = (params?: ParcelParams) => {
  return useQuery<ApiResponse<Parcel[]>, Error>({
    queryKey: ["parcels", params],
    queryFn: async () => {
      const response = await parcelsAPI.getAll(params);
      return response.data;
    },
  });
};

export const useParcel = (id: number) => {
  return useQuery<ApiResponse<Parcel>, Error>({
    queryKey: ["parcel", id],
    queryFn: async () => {
      const response = await parcelsAPI.getById(id);
      return response.data;
    },
    enabled: !!id && id > 0,
  });
};

export const useCreateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Parcel>, Error, Partial<Parcel>>({
    mutationFn: async (data) => {
      const response = await parcelsAPI.create(data);
      return response.data;
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

export const useAddSoilAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SoilAnalysis>,
    Error,
    {
      parcelId: number;
      data: SoilAnalysisData;
    }
  >({
    mutationFn: async ({ parcelId, data }) => {
      const response = await parcelsAPI.addSoilAnalysis(parcelId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["parcel", variables.parcelId],
      });
      toast.success("Analyse du sol enregistrée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });
};

// ========== PRODUCTIONS HOOKS ==========

export const useProductions = (params?: ProductionParams) => {
  return useQuery<ApiResponse<Production[]>, Error>({
    queryKey: ["productions", params],
    queryFn: async () => {
      const response = await productionsAPI.getAll(params);
      return response.data;
    },
  });
};

export const useProduction = (id: number) => {
  return useQuery<ApiResponse<Production>, Error>({
    queryKey: ["production", id],
    queryFn: async () => {
      const response = await productionsAPI.getById(id);
      return response.data;
    },
    enabled: !!id && id > 0,
  });
};

export const useCreateProduction = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Production>, Error, Partial<Production>>({
    mutationFn: async (data) => {
      const response = await productionsAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productions"] });
      toast.success("Production créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });
};

export const useAddProductionActivity = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ProductionActivity>,
    Error,
    {
      productionId: number;
      data: ActivityData;
    }
  >({
    mutationFn: async ({ productionId, data }) => {
      const response = await productionsAPI.addActivity(productionId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["production", variables.productionId],
      });
      toast.success("Activité enregistrée avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });
};

export const useAddProductionIssue = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ProductionIssue>,
    Error,
    {
      productionId: number;
      data: IssueData;
    }
  >({
    mutationFn: async ({ productionId, data }) => {
      const response = await productionsAPI.addIssue(productionId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["production", variables.productionId],
      });
      toast.success("Problème enregistré avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });
};

export const useAddWeatherData = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<WeatherData>,
    Error,
    {
      productionId: number;
      data: WeatherInputData;
    }
  >({
    mutationFn: async ({ productionId, data }) => {
      const response = await productionsAPI.addWeatherData(productionId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["production", variables.productionId],
      });
      toast.success("Données météo enregistrées avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    },
  });
};

// ========== VARIETIES HOOKS ==========

export const useVarieties = (params?: VarietyParams) => {
  return useQuery<ApiResponse<Variety[]>, Error>({
    queryKey: ["varieties", params],
    queryFn: async () => {
      const response = await varietiesAPI.getAll(params);
      return response.data;
    },
  });
};

export const useVariety = (id: string) => {
  return useQuery<ApiResponse<Variety>, Error>({
    queryKey: ["variety", id],
    queryFn: async () => {
      const response = await varietiesAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// ========== USERS HOOKS ==========

export const useUsers = (params?: UserParams) => {
  return useQuery<ApiResponse<User[]>, Error>({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await usersAPI.getAll(params);
      return response.data;
    },
  });
};

export const useUser = (id: number) => {
  return useQuery<ApiResponse<User>, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await usersAPI.getById(id);
      return response.data;
    },
    enabled: !!id && id > 0,
  });
};

// ========== REPORTS HOOKS ==========

export const useReports = (params?: ReportParams) => {
  return useQuery<ApiResponse<Report[]>, Error>({
    queryKey: ["reports", params],
    queryFn: async () => {
      const response = await reportsAPI.getAll(params);
      return response.data;
    },
  });
};

export const useProductionReport = (params?: Record<string, unknown>) => {
  return useQuery<ApiResponse<ProductionReportData>, Error>({
    queryKey: ["productionReport", params],
    queryFn: async () => {
      const response = await reportsAPI.getProduction(params);
      return response.data;
    },
    enabled: !!params,
  });
};

export const useQualityReport = (params?: Record<string, unknown>) => {
  return useQuery<ApiResponse<QualityReportData>, Error>({
    queryKey: ["qualityReport", params],
    queryFn: async () => {
      const response = await reportsAPI.getQuality(params);
      return response.data;
    },
    enabled: !!params,
  });
};

// ========== STATISTICS HOOKS ==========

export const useDashboardStats = () => {
  return useQuery<ApiResponse<DashboardStats>, Error>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await statisticsAPI.getDashboard();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMonthlyTrends = (months: number = 12) => {
  return useQuery<ApiResponse<TrendsData>, Error>({
    queryKey: ["monthlyTrends", months],
    queryFn: async () => {
      const response = await statisticsAPI.getTrends(months);
      return response.data;
    },
  });
};
