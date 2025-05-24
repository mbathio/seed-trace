// frontend/src/utils/seedTypes.ts - Version mise à jour avec tous les types nécessaires

// Define user roles
export type UserRole =
  | "admin"
  | "manager"
  | "inspector"
  | "multiplier"
  | "guest"
  | "technician"
  | "researcher"; // Ajout du rôle researcher

// User interface
export interface User {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

// Seed levels
export type SeedLevel = "GO" | "G1" | "G2" | "G3" | "G4" | "R1" | "R2";

// Crop types
export type CropType =
  | "rice"
  | "maize"
  | "peanut"
  | "sorghum"
  | "cowpea"
  | "millet";

// Define parcel status
export type ParcelStatus = "available" | "in-use" | "resting";

// Parcel interface - mise à jour avec tous les champs nécessaires
export interface Parcel {
  id: number;
  name?: string;
  area: number;
  location: {
    lat: number;
    lng: number;
  };
  status: ParcelStatus;
  soilType?: string;
  irrigationSystem?: string;
  address?: string;
  multiplier?: number; // ID of the multiplier who owns/manages the parcel
  soilAnalysis?: {
    date: Date;
    pH: string;
    organicMatter: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  previousCrops?: {
    crop: string;
    year: number;
    season: string;
  }[];
}

// Contract status
export type ContractStatus = "draft" | "active" | "completed" | "cancelled";

// Contract interface
export interface Contract {
  id: number;
  multiplierId: number;
  startDate: Date;
  endDate: Date;
  cropType: CropType;
  seedLevel: SeedLevel;
  expectedQuantity: number;
  status: ContractStatus;
  parcelId?: number;
  paymentTerms?: string;
  varietyId?: string;
  quantity?: number;
}

// Production history item
export interface ProductionHistoryItem {
  contractId: number;
  cropType: CropType;
  seedLevel: SeedLevel;
  level?: SeedLevel; // Add level for backward compatibility
  season: string;
  year: number;
  quantity: number;
  qualityScore?: number;
  varietyId: string;
}

// Certification level for multipliers
export type CertificationLevel = "beginner" | "intermediate" | "expert";

// Multiplier interface - mise à jour avec tous les champs nécessaires
export interface Multiplier {
  id: number;
  name: string;
  status: "active" | "inactive";
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  yearsExperience: number;
  certificationLevel: CertificationLevel;
  specialization: string[];
  phone?: string;
  email?: string;
  parcels?: number[]; // IDs of parcels managed by this multiplier
  contracts?: Contract[];
  history?: ProductionHistoryItem[];
}

// Seed lot status
export type SeedLotStatus =
  | "pending"
  | "certified"
  | "rejected"
  | "in-stock"
  | "sold"
  | "active"
  | "distributed";

// Seed lot interface - mise à jour avec tous les champs nécessaires
export interface SeedLot {
  id: string;
  cropType: CropType;
  variety: string;
  varietyId: string;
  level: SeedLevel;
  quantity: number;
  productionDate: string; // ISO date string
  expiryDate?: string; // ISO date string
  multiplier?: number; // ID of the multiplier
  status: SeedLotStatus;
  parcelId?: number;
  batchNumber?: string;
  parentLotId?: string; // For traceability
}

// Quality control interface - mise à jour avec tous les champs nécessaires
export interface QualityControl {
  id: number;
  lotId: string;
  controlDate: Date;
  germinationRate: number;
  varietyPurity: number;
  result: "pass" | "fail";
  observations?: string;
  inspectorId: number;
  moistureContent?: number;
  seedHealth?: number;
  testMethod?: string;
}

// Activity type
export type ActivityType =
  | "soil_preparation"
  | "sowing"
  | "fertilization"
  | "irrigation"
  | "weeding"
  | "pest_control"
  | "harvest"
  | "other";

// Issue type
export type IssueType = "disease" | "pest" | "weather" | "management" | "other";

// Issue severity
export type IssueSeverity = "low" | "medium" | "high";

// Activity interface
export interface Activity {
  type: ActivityType;
  date: string;
  description: string;
  personnel?: string[];
  inputs?: { name: string; quantity: string; unit: string }[];
  notes?: string;
}

// Issue interface
export interface Issue {
  date: string;
  type: IssueType;
  description: string;
  severity: IssueSeverity;
  actions: string;
  resolved: boolean;
}

// Weather data interface
export interface WeatherData {
  date: string;
  temperature: string;
  rainfall: string;
  humidity: string;
}

// Production status
export type ProductionStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "cancelled";

// Production interface - mise à jour avec tous les champs nécessaires
export interface Production {
  id: number;
  lotId: string;
  startDate: Date;
  endDate?: Date;
  multiplier: number;
  parcelId: number;
  status: ProductionStatus;
  yield?: number;
  notes?: string;
  sowingDate?: Date;
  harvestDate?: Date;
  plannedQuantity?: number;
  activities?: Activity[];
  issues?: Issue[];
  weatherData?: WeatherData[];
}

// Report interface
// Définir des types spécifiques pour les données de rapport
export interface ProductionReportData {
  totalProduction: number;
  totalSurface: number;
  averageYield: number;
  productionByRegion: {
    region: string;
    production: number;
    surface: number;
  }[];
  productionByCrop: {
    crop: string;
    production: number;
  }[];
}

export interface QualityReportData {
  totalTests: number;
  passRate: number;
  averageGerminationRate: number;
  averageVarietyPurity: number;
  qualityByLevel: {
    level: SeedLevel;
    passRate: number;
    averageGermination: number;
  }[];
}

export interface InventoryReportData {
  totalLots: number;
  totalQuantity: number;
  lotsByLevel: {
    level: SeedLevel;
    count: number;
    quantity: number;
  }[];
  lotsByCrop: {
    crop: CropType;
    count: number;
    quantity: number;
  }[];
}

export interface MultiplierPerformanceData {
  totalMultipliers: number;
  activeMultipliers: number;
  averageExperience: number;
  performanceByMultiplier: {
    multiplierId: number;
    name: string;
    totalProduction: number;
    averageQuality: number;
    contractsCompleted: number;
  }[];
}

// Union type pour tous les types de données de rapport
export type ReportData =
  | ProductionReportData
  | QualityReportData
  | InventoryReportData
  | MultiplierPerformanceData
  | Record<string, unknown>; // Pour les rapports personnalisés

// Interface Report mise à jour
export interface Report {
  id: number;
  title: string;
  type:
    | "production"
    | "quality"
    | "inventory"
    | "multiplier_performance"
    | "custom";
  creationDate: string;
  createdBy: number;
  data?: ReportData;
  fileName?: string;
}

// Variety interface - mise à jour avec tous les champs nécessaires
export interface Variety {
  id: string;
  name: string;
  cropType: CropType;
  description?: string;
  maturityDays: number;
  yieldPotential?: number;
  resistances?: string[];
  origin?: string;
  releaseYear?: number;
}

// Mock data for users
export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Admin User",
    role: "admin",
    email: "admin@isra.sn",
    avatar: "/avatars/admin.png",
  },
  {
    id: 2,
    name: "Amadou Diallo",
    role: "manager",
    email: "amadou@isra.sn",
    avatar: "/avatars/manager.png",
  },
  {
    id: 3,
    name: "Marie Faye",
    role: "manager",
    email: "marie@isra.sn",
  },
  {
    id: 4,
    name: "Ousmane Ndiaye",
    role: "inspector",
    email: "ousmane@isra.sn",
  },
  {
    id: 5,
    name: "Fatou Sow",
    role: "multiplier",
    email: "fatou@gmail.com",
  },
];

// Mock data for parcels
export const MOCK_PARCELS: Parcel[] = [
  {
    id: 1,
    name: "Parcelle Dagana 01",
    area: 5.2,
    location: {
      lat: 16.5182,
      lng: -15.5046,
    },
    status: "in-use",
    soilType: "Argilo-limoneux",
    irrigationSystem: "Goutte-à-goutte",
    address: "Zone agricole de Dagana, Saint-Louis",
    multiplier: 5,
    soilAnalysis: {
      date: new Date("2023-01-15"),
      pH: "6.8",
      organicMatter: "3.2",
      nitrogen: "0.15",
      phosphorus: "32",
      potassium: "180",
    },
    previousCrops: [
      {
        crop: "Riz",
        year: 2022,
        season: "Hivernage",
      },
      {
        crop: "Maïs",
        year: 2022,
        season: "Contre-saison chaude",
      },
    ],
  },
  {
    id: 2,
    name: "Parcelle Podor 02",
    area: 3.8,
    location: {
      lat: 16.6518,
      lng: -14.9592,
    },
    status: "available",
    soilType: "Sableux",
    irrigationSystem: "Aspersion",
    address: "Périmètre irrigué de Podor",
    multiplier: 3,
    previousCrops: [
      {
        crop: "Niébé",
        year: 2022,
        season: "Contre-saison froide",
      },
    ],
  },
  {
    id: 3,
    name: "Parcelle Richard-Toll 03",
    area: 7.5,
    location: {
      lat: 16.4625,
      lng: -15.7009,
    },
    status: "resting",
    soilType: "Limono-sableux",
    irrigationSystem: "Gravitaire",
    address: "Compagnie Sucrière Sénégalaise, Richard-Toll",
  },
  {
    id: 4,
    name: "Parcelle Matam 04",
    area: 4.2,
    location: {
      lat: 15.6552,
      lng: -13.2578,
    },
    status: "in-use",
    soilType: "Argilo-sableux",
    irrigationSystem: "Goutte-à-goutte",
    address: "Zone agricole de Matam",
  },
];

// Mock data for multipliers
export const MOCK_MULTIPLIERS: Multiplier[] = [
  {
    id: 1,
    name: "Ibrahima Ba",
    status: "active",
    address: "Dagana, Saint-Louis",
    location: {
      lat: 16.5182,
      lng: -15.5046,
    },
    yearsExperience: 8,
    certificationLevel: "expert",
    specialization: ["rice", "maize"],
    phone: "77 123 45 67",
    email: "ibrahima@example.com",
    parcels: [1],
    contracts: [
      {
        id: 101,
        multiplierId: 1,
        startDate: new Date("2023-01-10"),
        endDate: new Date("2023-06-30"),
        cropType: "rice",
        seedLevel: "G1",
        expectedQuantity: 5000,
        status: "active",
        parcelId: 1,
      },
    ],
    history: [
      {
        contractId: 98,
        cropType: "rice",
        seedLevel: "G1",
        level: "G1",
        season: "Hivernage",
        year: 2022,
        quantity: 4800,
        qualityScore: 92,
        varietyId: "Sahel 202",
      },
      {
        contractId: 87,
        cropType: "maize",
        seedLevel: "G2",
        level: "G2",
        season: "Contre-saison",
        year: 2022,
        quantity: 3200,
        qualityScore: 88,
        varietyId: "ZM309",
      },
    ],
  },
  {
    id: 2,
    name: "Aminata Diallo",
    status: "active",
    address: "Podor, Saint-Louis",
    location: {
      lat: 16.6518,
      lng: -14.9592,
    },
    yearsExperience: 5,
    certificationLevel: "intermediate",
    specialization: ["rice", "peanut"],
    phone: "77 234 56 78",
    email: "aminata@example.com",
    parcels: [2],
  },
  {
    id: 3,
    name: "Mamadou Sow",
    status: "inactive",
    address: "Richard-Toll, Saint-Louis",
    location: {
      lat: 16.4625,
      lng: -15.7009,
    },
    yearsExperience: 10,
    certificationLevel: "expert",
    specialization: ["rice", "sorghum", "millet"],
    parcels: [3],
  },
  {
    id: 4,
    name: "Aissatou Ndiaye",
    status: "active",
    address: "Matam",
    location: {
      lat: 15.6552,
      lng: -13.2578,
    },
    yearsExperience: 3,
    certificationLevel: "beginner",
    specialization: ["maize", "cowpea"],
    phone: "77 345 67 89",
    parcels: [4],
  },
];

// Mock data for seed lots
export const MOCK_SEED_LOTS: SeedLot[] = [
  {
    id: "SL-GO-2023-001",
    cropType: "rice",
    variety: "Sahel 108",
    varietyId: "sahel108",
    level: "GO",
    quantity: 500,
    productionDate: "2023-01-15",
    expiryDate: "2024-01-15",
    multiplier: 1,
    status: "certified",
    parcelId: 1,
    batchNumber: "BATCH-001",
  },
  {
    id: "SL-G1-2023-001",
    cropType: "rice",
    variety: "Sahel 108",
    varietyId: "sahel108",
    level: "G1",
    quantity: 1500,
    productionDate: "2023-02-20",
    expiryDate: "2024-02-20",
    multiplier: 1,
    status: "in-stock",
    parcelId: 1,
    batchNumber: "BATCH-002",
    parentLotId: "SL-GO-2023-001",
  },
  {
    id: "SL-G2-2023-001",
    cropType: "rice",
    variety: "Sahel 202",
    varietyId: "sahel202",
    level: "G2",
    quantity: 3000,
    productionDate: "2023-03-10",
    expiryDate: "2024-03-10",
    multiplier: 2,
    status: "in-stock",
    parcelId: 2,
    batchNumber: "BATCH-003",
  },
  {
    id: "SL-GO-2023-002",
    cropType: "maize",
    variety: "ZM309",
    varietyId: "zm309",
    level: "GO",
    quantity: 300,
    productionDate: "2023-04-05",
    expiryDate: "2024-04-05",
    multiplier: 3,
    status: "certified",
    parcelId: 3,
    batchNumber: "BATCH-004",
  },
];

// Mock data for varieties
export const MOCK_VARIETIES: Variety[] = [
  {
    id: "sahel108",
    name: "Sahel 108",
    cropType: "rice",
    description:
      "Variété de cycle court (100-110 jours) adaptée aux zones irriguées du Nord",
    maturityDays: 105,
    yieldPotential: 9.5,
    resistances: ["Blast", "Virus de la panachure jaune"],
    origin: "AfricaRice",
    releaseYear: 1994,
  },
  {
    id: "sahel202",
    name: "Sahel 202",
    cropType: "rice",
    description:
      "Variété améliorée à haut rendement, bien adaptée aux conditions sahéliennes",
    maturityDays: 125,
    yieldPotential: 10,
    resistances: ["Blast", "Pyriculariose"],
    origin: "ISRA/AfricaRice",
    releaseYear: 2007,
  },
  {
    id: "zm309",
    name: "ZM309",
    cropType: "maize",
    description:
      "Variété de maïs tolérante à la sécheresse, adaptée aux zones semi-arides",
    maturityDays: 95,
    yieldPotential: 7.2,
    resistances: ["Streak", "Rouille"],
    origin: "IITA",
    releaseYear: 2012,
  },
  {
    id: "73-33",
    name: "73-33",
    cropType: "peanut",
    description:
      "Variété d'arachide traditionnelle du Sénégal, bien adaptée aux zones sahéliennes",
    maturityDays: 90,
    yieldPotential: 3.5,
    origin: "ISRA",
    releaseYear: 1973,
  },
];

// Mock quality controls
export const MOCK_QUALITY_CONTROLS: QualityControl[] = [
  {
    id: 1,
    lotId: "SL-GO-2023-001",
    controlDate: new Date("2023-01-20"),
    germinationRate: 95,
    varietyPurity: 99.8,
    result: "pass",
    inspectorId: 4,
    moistureContent: 12.5,
    seedHealth: 98,
  },
  {
    id: 2,
    lotId: "SL-G1-2023-001",
    controlDate: new Date("2023-02-25"),
    germinationRate: 92,
    varietyPurity: 98.5,
    result: "pass",
    inspectorId: 4,
    moistureContent: 13.0,
    seedHealth: 96,
  },
  {
    id: 3,
    lotId: "SL-G2-2023-001",
    controlDate: new Date("2023-03-15"),
    germinationRate: 88,
    varietyPurity: 96.0,
    result: "pass",
    inspectorId: 4,
    moistureContent: 13.8,
  },
  {
    id: 4,
    lotId: "SL-GO-2023-002",
    controlDate: new Date("2023-04-10"),
    germinationRate: 78,
    varietyPurity: 94.5,
    result: "fail",
    observations: "Taux de germination insuffisant",
    inspectorId: 4,
    moistureContent: 14.2,
  },
];

// Sample activities data
const sampleActivities: Activity[] = [
  {
    type: "soil_preparation",
    date: "2023-03-01",
    description: "Labour profond et préparation du sol",
    personnel: ["Jean Diop", "Amadou Ndiaye"],
    inputs: [
      { name: "Tracteur", quantity: "4", unit: "heures" },
      { name: "Carburant", quantity: "25", unit: "litres" },
    ],
    notes: "Sol en bon état, bonne structure",
  },
  {
    type: "sowing",
    date: "2023-03-15",
    description: "Semis du lot G1",
    personnel: ["Aminata Sow", "Ibrahima Fall"],
    inputs: [
      { name: "Semences GO", quantity: "50", unit: "kg" },
      { name: "Engrais de fond NPK", quantity: "100", unit: "kg" },
    ],
  },
];

// Sample issues data
const sampleIssues: Issue[] = [
  {
    date: "2023-04-10",
    type: "pest",
    description: "Présence importante de foreurs de tiges",
    severity: "medium",
    actions: "Application de biopesticide à base de neem",
    resolved: true,
  },
];

// Sample weather data
const sampleWeatherData: WeatherData[] = [
  {
    date: "2023-03-01",
    temperature: "32",
    rainfall: "0",
    humidity: "45",
  },
  {
    date: "2023-03-15",
    temperature: "34",
    rainfall: "12",
    humidity: "65",
  },
];

// Mock production data
export const MOCK_PRODUCTIONS: Production[] = [
  {
    id: 1,
    lotId: "SL-G1-2023-001",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2023-07-15"),
    multiplier: 1,
    parcelId: 1,
    status: "completed",
    yield: 4.8,
    notes: "Bonne production malgré un épisode de sécheresse en mai",
    sowingDate: new Date("2023-03-01"),
    harvestDate: new Date("2023-07-15"),
    plannedQuantity: 5000,
    activities: sampleActivities,
    issues: sampleIssues,
    weatherData: sampleWeatherData,
  },
  {
    id: 2,
    lotId: "SL-G2-2023-001",
    startDate: new Date("2023-03-20"),
    multiplier: 2,
    parcelId: 2,
    status: "in-progress",
    notes: "Retard dans le semis dû aux pluies tardives",
    sowingDate: new Date("2023-03-20"),
    plannedQuantity: 3000,
    activities: [],
    issues: [],
    weatherData: [],
  },
  {
    id: 3,
    lotId: "SL-GO-2023-002",
    startDate: new Date("2023-05-01"),
    endDate: new Date("2023-08-10"),
    multiplier: 3,
    parcelId: 3,
    status: "completed",
    yield: 3.9,
    notes: "Production affectée par une attaque de chenilles en juin",
    sowingDate: new Date("2023-05-01"),
    harvestDate: new Date("2023-08-10"),
    plannedQuantity: 2500,
    activities: [],
    issues: [],
    weatherData: [],
  },
];

// Mock reports
export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    title: "Rapport de production 2023 - T1",
    type: "production",
    creationDate: "2023-04-01",
    createdBy: 2,
    fileName: "production_rapport_t1_2023.pdf",
  },
  {
    id: 2,
    title: "Analyse qualité des semences G1",
    type: "quality",
    creationDate: "2023-03-15",
    createdBy: 4,
    fileName: "qualite_g1_2023.pdf",
  },
  {
    id: 3,
    title: "Performance multiplicateurs région Nord",
    type: "multiplier_performance",
    creationDate: "2023-02-28",
    createdBy: 2,
    fileName: "perf_multiplicateurs_nord_2023.xlsx",
  },
  {
    id: 4,
    title: "Rapport qualité - Riz Sahel",
    type: "quality",
    creationDate: "2023-05-10",
    createdBy: 4,
    fileName: "qualite_riz_sahel.pdf",
  },
];
