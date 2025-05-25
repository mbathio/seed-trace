// frontend/src/utils/seedTypes.ts - Version corrigée pour cohérence avec backend

// Types de base corrigés pour correspondre au backend
export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "INSPECTOR"
  | "MULTIPLIER"
  | "GUEST"
  | "TECHNICIAN"
  | "RESEARCHER";

export type SeedLevel = "GO" | "G1" | "G2" | "G3" | "G4" | "R1" | "R2";

export type SeedLotStatus =
  | "PENDING"
  | "CERTIFIED"
  | "REJECTED"
  | "IN_STOCK"
  | "SOLD"
  | "ACTIVE"
  | "DISTRIBUTED";

export type ParcelStatus = "AVAILABLE" | "IN_USE" | "RESTING";

export type ProductionStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type QualityControlResult = "PASS" | "FAIL";

export type MultiplierStatus = "ACTIVE" | "INACTIVE";

export type CertificationLevel = "BEGINNER" | "INTERMEDIATE" | "EXPERT";

export type ContractStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type CropType =
  | "RICE"
  | "MAIZE"
  | "PEANUT"
  | "SORGHUM"
  | "COWPEA"
  | "MILLET";

// Interface User corrigée
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Interface Variety corrigée pour correspondre au backend
export interface Variety {
  id: number; // Backend utilise integer ID
  code: string; // Backend a un champ code séparé
  name: string;
  cropType: CropType;
  description?: string;
  maturityDays: number;
  yieldPotential?: number;
  resistances?: string[];
  origin?: string;
  releaseYear?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Interface SeedLot corrigée
export interface SeedLot {
  id: string;
  varietyId: number; // Correspond au backend
  level: SeedLevel;
  quantity: number;
  productionDate: string;
  expiryDate?: string;
  multiplierId?: number;
  parcelId?: number;
  parentLotId?: string;
  status: SeedLotStatus;
  notes?: string;
  qrCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;

  // Relations (populated par l'API)
  variety?: Variety;
  multiplier?: Multiplier;
  parcel?: Parcel;
  parentLot?: SeedLot;
  childLots?: SeedLot[];
}

// Interface QualityControl corrigée
export interface QualityControl {
  id: number;
  lotId: string;
  controlDate: string; // Backend envoie string ISO
  germinationRate: number;
  varietyPurity: number;
  moistureContent?: number;
  seedHealth?: number;
  result: QualityControlResult;
  observations?: string;
  testMethod?: string;
  inspectorId: number;
  createdAt: string;
  updatedAt?: string;

  // Relations
  seedLot?: SeedLot;
  inspector?: User;
}

// Interface Multiplier corrigée
export interface Multiplier {
  id: number;
  name: string;
  status: MultiplierStatus;
  address: string;
  latitude: number;
  longitude: number;
  yearsExperience: number;
  certificationLevel: CertificationLevel;
  specialization: string[];
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;

  // Relations
  parcels?: Parcel[];
  contracts?: Contract[];
  seedLots?: SeedLot[];
  productions?: Production[];
  history?: MultiplierHistory[];
}

// Interface Parcel corrigée
export interface Parcel {
  id: number;
  name?: string;
  area: number;
  latitude: number;
  longitude: number;
  status: ParcelStatus;
  soilType?: string;
  irrigationSystem?: string;
  address?: string;
  multiplierId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;

  // Relations
  multiplier?: Multiplier;
  soilAnalyses?: SoilAnalysis[];
  previousCrops?: PreviousCrop[];
  seedLots?: SeedLot[];
  productions?: Production[];
}

// Interface Production corrigée
export interface Production {
  id: number;
  lotId: string;
  multiplierId: number;
  parcelId: number;
  startDate: string;
  endDate?: string;
  sowingDate?: string;
  harvestDate?: string;
  plannedQuantity?: number;
  actualYield?: number;
  status: ProductionStatus;
  notes?: string;
  weatherConditions?: string;
  createdAt: string;
  updatedAt?: string;

  // Relations
  seedLot?: SeedLot;
  multiplier?: Multiplier;
  parcel?: Parcel;
  activities?: ProductionActivity[];
  issues?: ProductionIssue[];
  weatherData?: WeatherData[];
}

// Interfaces complémentaires pour correspondre au backend
export interface SoilAnalysis {
  id: number;
  parcelId: number;
  analysisDate: string;
  pH?: number;
  organicMatter?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  notes?: string;
  createdAt: string;
}

export interface PreviousCrop {
  id: number;
  parcelId: number;
  crop: string;
  year: number;
  season: string;
  createdAt: string;
}

export interface Contract {
  id: number;
  multiplierId: number;
  varietyId: number;
  startDate: string;
  endDate: string;
  seedLevel: SeedLevel;
  expectedQuantity: number;
  parcelId?: number;
  paymentTerms?: string;
  notes?: string;
  status: ContractStatus;
  createdAt: string;

  // Relations
  multiplier?: Multiplier;
  variety?: Variety;
  parcel?: Parcel;
}

export interface MultiplierHistory {
  id: number;
  multiplierId: number;
  year: number;
  season: string;
  varietyId: number;
  level: SeedLevel;
  quantity: number;
  qualityScore: number;
  createdAt: string;

  // Relations
  variety?: Variety;
}

export interface ProductionActivity {
  id: number;
  productionId: number;
  type: string;
  activityDate: string;
  description: string;
  personnel?: string[];
  notes?: string;
  userId?: number;
  createdAt: string;

  // Relations
  user?: User;
  inputs?: ActivityInput[];
}

export interface ActivityInput {
  id: number;
  activityId: number;
  name: string;
  quantity: string;
  unit: string;
  cost?: number;
}

export interface ProductionIssue {
  id: number;
  productionId: number;
  issueDate: string;
  type: string;
  description: string;
  severity: string;
  actions: string;
  cost?: number;
  resolved: boolean;
  createdAt: string;
}

export interface WeatherData {
  id: number;
  productionId: number;
  recordDate: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed?: number;
  notes?: string;
  source?: string;
  createdAt: string;
}

export interface Report {
  id: number;
  title: string;
  type: string;
  description?: string;
  createdById: number;
  parameters?: any;
  data?: any;
  isPublic: boolean;
  createdAt: string;

  // Relations
  createdBy?: User;
}

// Correction des données mock pour correspondre aux nouveaux types
export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Amadou Diop",
    email: "adiop@isra.sn",
    role: "RESEARCHER",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Fatou Sy",
    email: "fsy@isra.sn",
    role: "INSPECTOR",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Moussa Kane",
    email: "mkane@isra.sn",
    role: "TECHNICIAN",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Ousmane Ndiaye",
    email: "ondiaye@isra.sn",
    role: "MANAGER",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Admin User",
    email: "admin@isra.sn",
    role: "ADMIN",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
];

export const MOCK_VARIETIES: Variety[] = [
  {
    id: 1,
    code: "SAHEL108",
    name: "Sahel 108",
    cropType: "RICE",
    description: "Variété de riz adaptée aux zones irriguées",
    maturityDays: 105,
    yieldPotential: 9.5,
    resistances: ["Blast", "Virus panachure jaune"],
    origin: "AfricaRice",
    releaseYear: 1994,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    code: "SAHEL202",
    name: "Sahel 202",
    cropType: "RICE",
    description: "Variété améliorée à haut rendement",
    maturityDays: 125,
    yieldPotential: 10.0,
    resistances: ["Blast", "Pyriculariose"],
    origin: "ISRA/AfricaRice",
    releaseYear: 2007,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    code: "ZM309",
    name: "ZM309",
    cropType: "MAIZE",
    description: "Variété de maïs tolérante à la sécheresse",
    maturityDays: 95,
    yieldPotential: 7.2,
    resistances: ["Streak", "Rouille"],
    origin: "IITA",
    releaseYear: 2012,
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
  },
];

export const MOCK_SEED_LOTS: SeedLot[] = [
  {
    id: "SL-GO-2023-001",
    varietyId: 1,
    level: "GO",
    quantity: 500,
    productionDate: "2023-01-15",
    expiryDate: "2024-01-15",
    multiplierId: 1,
    parcelId: 1,
    status: "CERTIFIED",
    notes: "Lot de base excellent",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "SL-G1-2023-001",
    varietyId: 1,
    level: "G1",
    quantity: 1500,
    productionDate: "2023-06-20",
    expiryDate: "2024-06-20",
    multiplierId: 1,
    parcelId: 1,
    parentLotId: "SL-GO-2023-001",
    status: "ACTIVE",
    notes: "Production de G1 à partir du lot GO",
    isActive: true,
    createdAt: "2023-06-20T00:00:00Z",
  },
  {
    id: "SL-G2-2023-001",
    varietyId: 2,
    level: "G2",
    quantity: 3000,
    productionDate: "2023-11-15",
    expiryDate: "2024-11-15",
    multiplierId: 2,
    parcelId: 2,
    status: "DISTRIBUTED",
    notes: "Lot G2 distribué aux multiplicateurs",
    isActive: true,
    createdAt: "2023-11-15T00:00:00Z",
  },
];

// Correction des interfaces utilisées dans les hooks API
export interface CreateSeedLotData {
  varietyId: number; // Correction: number au lieu de string
  level: SeedLevel;
  quantity: number;
  productionDate: string;
  multiplierId?: number;
  parcelId?: number;
  parentLotId?: string;
  notes?: string;
}

export interface UpdateSeedLotData {
  quantity?: number;
  status?: SeedLotStatus;
  notes?: string;
  expiryDate?: string;
}

export interface CreateQualityControlData {
  lotId: string;
  controlDate: string;
  germinationRate: number;
  varietyPurity: number;
  moistureContent?: number;
  seedHealth?: number;
  observations?: string;
  testMethod?: string;
}

// Interface pour les réponses API
export interface ApiResponse<T> {
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

// Interface pour les paramètres de pagination
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Interfaces spécifiques pour les paramètres de filtrage
export interface SeedLotParams extends PaginationParams {
  level?: SeedLevel;
  status?: SeedLotStatus;
  varietyId?: number;
  multiplierId?: number;
}

export interface QualityControlParams extends PaginationParams {
  result?: QualityControlResult;
  lotId?: string;
  inspectorId?: number;
}

export interface MultiplierParams extends PaginationParams {
  status?: MultiplierStatus;
  certificationLevel?: CertificationLevel;
}

export interface ParcelParams extends PaginationParams {
  status?: ParcelStatus;
  multiplierId?: number;
}

export interface ProductionParams extends PaginationParams {
  status?: ProductionStatus;
  multiplierId?: number;
}

// Fonctions utilitaires pour la conversion des types
export const convertUserRoleFromBackend = (backendRole: string): UserRole => {
  const roleMap: Record<string, UserRole> = {
    admin: "ADMIN",
    manager: "MANAGER",
    inspector: "INSPECTOR",
    multiplier: "MULTIPLIER",
    guest: "GUEST",
    technician: "TECHNICIAN",
    researcher: "RESEARCHER",
  };
  return roleMap[backendRole.toLowerCase()] || "GUEST";
};

export const convertUserRoleToBackend = (frontendRole: UserRole): string => {
  return frontendRole.toLowerCase();
};

export const convertStatusFromBackend = (
  backendStatus: string
): SeedLotStatus => {
  const statusMap: Record<string, SeedLotStatus> = {
    pending: "PENDING",
    certified: "CERTIFIED",
    rejected: "REJECTED",
    in_stock: "IN_STOCK",
    sold: "SOLD",
    active: "ACTIVE",
    distributed: "DISTRIBUTED",
  };
  return statusMap[backendStatus] || "PENDING";
};

export const convertStatusToBackend = (
  frontendStatus: SeedLotStatus
): string => {
  const statusMap: Record<SeedLotStatus, string> = {
    PENDING: "pending",
    CERTIFIED: "certified",
    REJECTED: "rejected",
    IN_STOCK: "in_stock",
    SOLD: "sold",
    ACTIVE: "active",
    DISTRIBUTED: "distributed",
  };
  return statusMap[frontendStatus] || "pending";
};
