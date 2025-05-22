// backend/src/types/entities.ts
export interface CreateSeedLotData {
  varietyId: string;
  level: string;
  quantity: number;
  productionDate: string;
  multiplierId?: number;
  parcelId?: number;
  parentLotId?: string;
  notes?: string;
}

export interface UpdateSeedLotData {
  quantity?: number;
  status?: string;
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

export interface CreateProductionData {
  lotId: string;
  multiplierId: number;
  parcelId: number;
  startDate: string;
  sowingDate?: string;
  plannedQuantity?: number;
  notes?: string;
}

export interface CreateMultiplierData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  yearsExperience: number;
  certificationLevel: string;
  specialization: string[];
  phone?: string;
  email?: string;
}
