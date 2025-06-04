// frontend/src/utils/seedTypes.ts - Version corrigée avec cohérence backend

// Types de base alignés avec le backend
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

export type ActivityType =
  | "SOIL_PREPARATION"
  | "SOWING"
  | "FERTILIZATION"
  | "IRRIGATION"
  | "WEEDING"
  | "PEST_CONTROL"
  | "HARVEST"
  | "OTHER";

export type IssueType = "DISEASE" | "PEST" | "WEATHER" | "MANAGEMENT" | "OTHER";

export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH";

// Interfaces principales
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

export interface Variety {
  id: number;
  code: string;
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

export interface SeedLot {
  id: string;
  varietyId: number;
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

  // Relations
  variety?: Variety;
  multiplier?: Multiplier;
  parcel?: Parcel;
  parentLot?: SeedLot;
  childLots?: SeedLot[];
}

export interface QualityControl {
  id: number;
  lotId: string;
  controlDate: string;
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
  parcels?: (Parcel | number)[];
  contracts?: Contract[];
  seedLots?: SeedLot[];
  productions?: Production[];
  history?: MultiplierHistory[];
}

export interface Parcel {
  id: number;
  name?: string;
  area: number;
  latitude: number;
  longitude: number;
  location: {
    lat: number;
    lng: number;
  };
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
  soilAnalysis?: SoilAnalysis;
}

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
  yield?: number;
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

// Interfaces complémentaires
export interface SoilAnalysis {
  id: number;
  parcelId: number;
  analysisDate: string;
  date?: Date;
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
  quantity?: number;
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
  type: ActivityType;
  activityDate: string;
  date?: Date;
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
  date?: Date;
  type: IssueType;
  description: string;
  severity: IssueSeverity;
  actions: string;
  cost?: number;
  resolved: boolean;
  createdAt: string;
}

export interface WeatherData {
  id: number;
  productionId: number;
  recordDate: string;
  date?: Date;
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
  parameters?: unknown;
  data?: unknown;
  isPublic: boolean;
  createdAt: string;
  creationDate?: Date;

  // Relations
  createdBy?: User;
}

// Interfaces API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  meta?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

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

// Interfaces pour création/mise à jour
export interface CreateSeedLotData {
  varietyId: number;
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

// Fonctions de conversion
export const convertUserRoleFromBackend = (backendRole: string): UserRole => {
  const normalizedRole = backendRole.toUpperCase() as UserRole;
  const validRoles: UserRole[] = [
    "ADMIN",
    "MANAGER",
    "INSPECTOR",
    "MULTIPLIER",
    "GUEST",
    "TECHNICIAN",
    "RESEARCHER",
  ];
  return validRoles.includes(normalizedRole) ? normalizedRole : "GUEST";
};

export const convertUserRoleToBackend = (frontendRole: UserRole): string => {
  return frontendRole;
};

export const convertStatusFromBackend = (
  backendStatus: string
): SeedLotStatus => {
  const normalizedStatus = backendStatus.toUpperCase() as SeedLotStatus;
  const validStatuses: SeedLotStatus[] = [
    "PENDING",
    "CERTIFIED",
    "REJECTED",
    "IN_STOCK",
    "SOLD",
    "ACTIVE",
    "DISTRIBUTED",
  ];
  return validStatuses.includes(normalizedStatus)
    ? normalizedStatus
    : "PENDING";
};

export const convertStatusToBackend = (
  frontendStatus: SeedLotStatus
): string => {
  return frontendStatus;
};

// Données MOCK
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

export const MOCK_PARCELS: Parcel[] = [
  {
    id: 1,
    name: "Parcelle Nord A1",
    area: 2.5,
    latitude: 16.0321,
    longitude: -16.4857,
    location: { lat: 16.0321, lng: -16.4857 },
    status: "AVAILABLE",
    soilType: "Argilo-limoneux",
    irrigationSystem: "Goutte à goutte",
    address: "Zone Nord, Saint-Louis",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    previousCrops: [
      {
        id: 1,
        parcelId: 1,
        crop: "Riz",
        year: 2022,
        season: "Hivernage",
        createdAt: "2023-01-01T00:00:00Z",
      },
    ],
    soilAnalysis: {
      id: 1,
      parcelId: 1,
      analysisDate: "2023-01-15T00:00:00Z",
      pH: 6.8,
      organicMatter: 3.2,
      nitrogen: 0.15,
      phosphorus: 25,
      potassium: 180,
      createdAt: "2023-01-15T00:00:00Z",
      date: new Date("2023-01-15"),
    },
  },
  {
    id: 2,
    name: "Parcelle Sud B2",
    area: 1.8,
    latitude: 15.9876,
    longitude: -16.5123,
    location: { lat: 15.9876, lng: -16.5123 },
    status: "IN_USE",
    soilType: "Sablo-argileux",
    irrigationSystem: "Aspersion",
    address: "Zone Sud, Saint-Louis",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    previousCrops: [
      {
        id: 2,
        parcelId: 2,
        crop: "Maïs",
        year: 2022,
        season: "Saison sèche",
        createdAt: "2023-01-01T00:00:00Z",
      },
    ],
  },
];

export const MOCK_MULTIPLIERS: Multiplier[] = [
  {
    id: 1,
    name: "Coopérative Walo",
    status: "ACTIVE",
    address: "Richard-Toll, Saint-Louis",
    latitude: 16.4625,
    longitude: -15.7081,
    yearsExperience: 12,
    certificationLevel: "EXPERT",
    specialization: ["Riz", "Maïs"],
    phone: "+221 77 123 45 67",
    email: "walo@coop.sn",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    contracts: [
      {
        id: 1,
        multiplierId: 1,
        varietyId: 1,
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        seedLevel: "G1",
        expectedQuantity: 2000,
        quantity: 2000,
        status: "ACTIVE",
        createdAt: "2023-01-01T00:00:00Z",
      },
    ],
    history: [
      {
        id: 1,
        multiplierId: 1,
        year: 2022,
        season: "Hivernage",
        varietyId: 1,
        level: "G1",
        quantity: 1800,
        qualityScore: 92,
        createdAt: "2023-01-01T00:00:00Z",
      },
    ],
    parcels: [1],
  },
  {
    id: 2,
    name: "GIE Ndiareme",
    status: "ACTIVE",
    address: "Dagana, Saint-Louis",
    latitude: 16.5125,
    longitude: -15.5089,
    yearsExperience: 8,
    certificationLevel: "INTERMEDIATE",
    specialization: ["Riz"],
    phone: "+221 76 987 65 43",
    email: "ndiareme@gie.sn",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    contracts: [],
    history: [],
    parcels: [2],
  },
];

export const MOCK_PRODUCTIONS: Production[] = [
  {
    id: 1,
    lotId: "SL-G1-2023-001",
    multiplierId: 1,
    parcelId: 1,
    startDate: "2023-06-01",
    endDate: "2023-11-30",
    sowingDate: "2023-06-15",
    harvestDate: "2023-11-15",
    plannedQuantity: 1500,
    actualYield: 1650,
    yield: 1650,
    status: "COMPLETED",
    notes: "Excellent rendement cette saison",
    createdAt: "2023-06-01T00:00:00Z",
    activities: [
      {
        id: 1,
        productionId: 1,
        type: "SOIL_PREPARATION",
        activityDate: "2023-06-01",
        description: "Préparation du sol avec labour profond",
        personnel: ["Amadou Diop", "Moussa Kane"],
        notes: "Conditions météo favorables",
        createdAt: "2023-06-01T00:00:00Z",
        date: new Date("2023-06-01"),
        inputs: [
          {
            id: 1,
            activityId: 1,
            name: "Diesel",
            quantity: "50",
            unit: "litres",
            cost: 75000,
          },
        ],
      },
    ],
    issues: [
      {
        id: 1,
        productionId: 1,
        issueDate: "2023-08-15",
        type: "PEST",
        description: "Attaque légère de criquets",
        severity: "LOW",
        actions: "Traitement biologique appliqué",
        cost: 25000,
        resolved: true,
        createdAt: "2023-08-15T00:00:00Z",
        date: new Date("2023-08-15"),
      },
    ],
    weatherData: [
      {
        id: 1,
        productionId: 1,
        recordDate: "2023-07-01",
        temperature: 32.5,
        rainfall: 45.2,
        humidity: 78,
        windSpeed: 12,
        notes: "Bonnes conditions pour la croissance",
        source: "Station météo locale",
        createdAt: "2023-07-01T00:00:00Z",
        date: new Date("2023-07-01"),
      },
    ],
  },
];

export const MOCK_QUALITY_CONTROLS: QualityControl[] = [
  {
    id: 1,
    lotId: "SL-GO-2023-001",
    controlDate: "2023-02-10",
    germinationRate: 95,
    varietyPurity: 98,
    result: "PASS",
    observations: "Excellente qualité, conforme aux normes",
    inspectorId: 4,
    moistureContent: 11.5,
    seedHealth: 97,
    createdAt: "2023-02-10T00:00:00Z",
  },
  {
    id: 2,
    lotId: "SL-G1-2023-001",
    controlDate: "2023-07-15",
    germinationRate: 92,
    varietyPurity: 97,
    result: "PASS",
    observations: "Qualité satisfaisante pour G1",
    inspectorId: 4,
    moistureContent: 12.0,
    seedHealth: 95,
    createdAt: "2023-07-15T00:00:00Z",
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    title: "Rapport de production Q3 2023",
    type: "production",
    description: "Analyse de la production du troisième trimestre",
    createdById: 4,
    isPublic: true,
    createdAt: "2023-10-01T00:00:00Z",
    creationDate: new Date("2023-10-01"),
  },
  {
    id: 2,
    title: "Contrôle qualité - Octobre 2023",
    type: "quality",
    description: "Résultats des tests de qualité d'octobre",
    createdById: 2,
    isPublic: false,
    createdAt: "2023-11-01T00:00:00Z",
    creationDate: new Date("2023-11-01"),
  },
];
