// frontend/src/utils/seedTypes.ts - Version corrigée avec compatibilité backend complète

// ========== ÉNUMÉRATIONS EN MAJUSCULES (Compatible Backend) ==========

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  INSPECTOR = "INSPECTOR",
  MULTIPLIER = "MULTIPLIER",
  GUEST = "GUEST",
  TECHNICIAN = "TECHNICIAN",
  RESEARCHER = "RESEARCHER",
}

export enum SeedLevel {
  GO = "GO",
  G1 = "G1",
  G2 = "G2",
  G3 = "G3",
  G4 = "G4",
  R1 = "R1",
  R2 = "R2",
}

export enum LotStatus {
  PENDING = "PENDING",
  CERTIFIED = "CERTIFIED",
  REJECTED = "REJECTED",
  IN_STOCK = "IN_STOCK",
  SOLD = "SOLD",
  ACTIVE = "ACTIVE",
  DISTRIBUTED = "DISTRIBUTED",
}

export enum CropType {
  RICE = "RICE",
  MAIZE = "MAIZE",
  PEANUT = "PEANUT",
  SORGHUM = "SORGHUM",
  COWPEA = "COWPEA",
  MILLET = "MILLET",
}

export enum ProductionStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum MultiplierStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum CertificationLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  EXPERT = "EXPERT",
}

export enum TestResult {
  PASS = "PASS",
  FAIL = "FAIL",
}

export enum ParcelStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  RESTING = "RESTING",
}

export enum ContractStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ActivityType {
  SOIL_PREPARATION = "SOIL_PREPARATION",
  SOWING = "SOWING",
  FERTILIZATION = "FERTILIZATION",
  IRRIGATION = "IRRIGATION",
  WEEDING = "WEEDING",
  PEST_CONTROL = "PEST_CONTROL",
  HARVEST = "HARVEST",
  OTHER = "OTHER",
}

export enum IssueType {
  DISEASE = "DISEASE",
  PEST = "PEST",
  WEATHER = "WEATHER",
  MANAGEMENT = "MANAGEMENT",
  OTHER = "OTHER",
}

export enum IssueSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// ========== INTERFACES PRINCIPALES ==========

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Variety {
  id: number;
  code: string;
  name: string;
  cropType: CropType;
  description?: string;
  maturityDays: number;
  yieldPotential?: number;
  resistances: string[];
  origin?: string;
  releaseYear?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    seedLots: number;
  };
}

export interface SeedLot {
  id: string;
  varietyId: number; // Toujours un number
  variety?: Variety;
  level: SeedLevel;
  quantity: number;
  productionDate: string; // Format ISO
  expiryDate?: string;
  multiplierId?: number;
  multiplier?: Multiplier;
  parcelId?: number;
  parcel?: Parcel;
  status: LotStatus;
  batchNumber?: string;
  parentLotId?: string;
  parentLot?: SeedLot;
  childLots?: SeedLot[];
  notes?: string;
  qrCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  qualityControls?: QualityControl[];
  _count?: {
    childLots: number;
    qualityControls: number;
  };
}

export interface QualityControl {
  id: number;
  lotId: string;
  seedLot?: SeedLot;
  controlDate: string; // Format ISO
  germinationRate: number;
  varietyPurity: number;
  moistureContent?: number;
  seedHealth?: number;
  result: TestResult;
  observations?: string;
  testMethod?: string;
  inspectorId: number;
  inspector?: User;
  createdAt: string;
  updatedAt: string;
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
  updatedAt: string;

  // Relations
  parcels?: Parcel[];
  contracts?: Contract[];
  seedLots?: SeedLot[];
  productions?: Production[];
  history?: MultiplierHistory[];
  _count?: {
    parcels: number;
    contracts: number;
    seedLots: number;
    productions: number;
  };
}

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
  multiplier?: Multiplier;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  soilAnalyses?: SoilAnalysis[];
  previousCrops?: PreviousCrop[];
  seedLots?: SeedLot[];
  productions?: Production[];
  _count?: {
    seedLots: number;
    productions: number;
  };
}

export interface Production {
  id: number;
  lotId: string;
  seedLot?: SeedLot;
  multiplierId: number;
  multiplier?: Multiplier;
  parcelId: number;
  parcel?: Parcel;
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
  updatedAt: string;

  // Relations
  activities?: ProductionActivity[];
  issues?: ProductionIssue[];
  weatherData?: WeatherData[];
  _count?: {
    activities: number;
    issues: number;
    weatherData: number;
  };
}

// ========== INTERFACES COMPLÉMENTAIRES ==========

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
  updatedAt: string;
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
  multiplier?: Multiplier;
  varietyId: number;
  variety?: Variety;
  startDate: string;
  endDate: string;
  seedLevel: SeedLevel;
  expectedQuantity: number;
  parcelId?: number;
  parcel?: Parcel;
  paymentTerms?: string;
  notes?: string;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MultiplierHistory {
  id: number;
  multiplierId: number;
  year: number;
  season: string;
  varietyId: number;
  variety?: Variety;
  level: SeedLevel;
  quantity: number;
  qualityScore: number;
  createdAt: string;
}

export interface ProductionActivity {
  id: number;
  productionId: number;
  type: ActivityType;
  activityDate: string;
  description: string;
  personnel: string[];
  notes?: string;
  userId?: number;
  user?: User;
  createdAt: string;
  updatedAt: string;

  // Relations
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
  type: IssueType;
  description: string;
  severity: IssueSeverity;
  actions: string;
  cost?: number;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
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
  updatedAt: string;
}

export interface Report {
  id: number;
  title: string;
  type: string;
  description?: string;
  createdById: number;
  createdBy?: User;
  parameters?: any;
  data?: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// ========== TYPES API ==========

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
  status?: LotStatus;
  varietyId?: number;
  multiplierId?: number;
}

export interface QualityControlParams extends PaginationParams {
  result?: TestResult;
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

// ========== TYPES POUR CRÉATION/MISE À JOUR ==========

export interface CreateSeedLotData {
  varietyId: number; // Toujours number
  level: SeedLevel;
  quantity: number;
  productionDate: string; // ISO string
  multiplierId?: number;
  parcelId?: number;
  parentLotId?: string;
  notes?: string;
}

export interface UpdateSeedLotData {
  quantity?: number;
  status?: LotStatus;
  notes?: string;
  expiryDate?: string;
}

export interface CreateQualityControlData {
  lotId: string;
  controlDate: string; // ISO string
  germinationRate: number;
  varietyPurity: number;
  moistureContent?: number;
  seedHealth?: number;
  observations?: string;
  testMethod?: string;
}

// ========== FONCTIONS DE CONVERSION ==========

export function convertRoleFromBackend(backendRole: string): Role {
  const normalizedRole = backendRole.toUpperCase();
  return Role[normalizedRole as keyof typeof Role] || Role.GUEST;
}

export function convertRoleToBackend(role: Role): string {
  return role;
}

export function convertStatusFromBackend(backendStatus: string): LotStatus {
  const normalizedStatus = backendStatus.toUpperCase();
  return (
    LotStatus[normalizedStatus as keyof typeof LotStatus] || LotStatus.PENDING
  );
}

export function convertStatusToBackend(status: LotStatus): string {
  return status;
}

// Helper pour formater les dates pour l'affichage
export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR");
}

// Helper pour formater les dates pour les inputs HTML
export function formatDateForInput(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

// Helper pour convertir les dates des inputs HTML vers ISO
export function formatDateToISO(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toISOString();
}
