
// ISRA seed levels
export type SeedLevel = 'GO' | 'G1' | 'G2' | 'G3' | 'R1' | 'R2';

// User roles
export type UserRole = 'researcher' | 'technician' | 'multiplier' | 'inspector' | 'manager' | 'admin';

// Seed lot interface
export interface SeedLot {
  id: string;
  varietyId: number;
  parentLotId?: string;
  level: SeedLevel;
  quantity: number;
  productionDate: Date;
  status: 'active' | 'distributed' | 'eliminated';
  qrCode?: string;
}

// Seed variety interface
export interface SeedVariety {
  id: number;
  name: string;
  description?: string;
  origin?: string;
  creationDate: Date;
}

// Quality control interface
export interface QualityControl {
  id: number;
  lotId: string;
  controlDate: Date;
  germinationRate: number;
  varietyPurity: number;
  result: 'pass' | 'fail';
  observations?: string;
}

// Field/parcel interface
export interface Parcel {
  id: number;
  location: { lat: number; lng: number };
  area: number;
  soilType?: string;
  status: 'available' | 'in-use' | 'resting';
}

// Production interface
export interface Production {
  id: number;
  lotId: string;
  parcelId: number;
  sowingDate: Date;
  harvestDate?: Date;
  yield?: number;
  conditions?: string;
  status: 'planning' | 'ongoing' | 'completed';
}

// Multiplier interface
export interface Multiplier {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
}

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

// Mock data for initial development
export const MOCK_VARIETIES: SeedVariety[] = [
  {
    id: 1,
    name: 'Sahel 108',
    description: 'Variété de riz à haut rendement adaptée au climat sahélien',
    origin: 'ISRA Saint-Louis',
    creationDate: new Date('2018-03-15')
  },
  {
    id: 2,
    name: 'Sahel 201',
    description: 'Variété de riz résistante à la sécheresse',
    origin: 'ISRA Saint-Louis',
    creationDate: new Date('2019-05-20')
  },
  {
    id: 3,
    name: 'Sahel 202',
    description: 'Variété de riz à cycle court',
    origin: 'ISRA Saint-Louis',
    creationDate: new Date('2020-02-10')
  }
];

export const MOCK_SEED_LOTS: SeedLot[] = [
  {
    id: 'SL-GO-2023-001',
    varietyId: 1,
    level: 'GO',
    quantity: 50,
    productionDate: new Date('2023-01-15'),
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SL-GO-2023-001'
  },
  {
    id: 'SL-G1-2023-001',
    varietyId: 1,
    parentLotId: 'SL-GO-2023-001',
    level: 'G1',
    quantity: 250,
    productionDate: new Date('2023-06-20'),
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SL-G1-2023-001'
  },
  {
    id: 'SL-G2-2023-001',
    varietyId: 1,
    parentLotId: 'SL-G1-2023-001',
    level: 'G2',
    quantity: 1000,
    productionDate: new Date('2023-11-10'),
    status: 'active',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SL-G2-2023-001'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: 'Amadou Diop',
    email: 'adiop@isra.sn',
    role: 'researcher',
    isActive: true
  },
  {
    id: 2,
    name: 'Fatou Sy',
    email: 'fsy@isra.sn',
    role: 'technician',
    isActive: true
  },
  {
    id: 3,
    name: 'Moussa Kane',
    email: 'mkane@isra.sn',
    role: 'manager',
    isActive: true
  }
];
