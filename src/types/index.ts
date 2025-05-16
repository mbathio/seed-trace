
// Types pour le système de traçabilité des semences

export type SeedLevel = 'GO' | 'G1' | 'G2' | 'G3' | 'R1' | 'R2';

export type SeedStatus = 'en_stock' | 'attribué' | 'en_production' | 'certifié' | 'épuisé';

export type CropVariety = {
  id: string;
  name: string;
  scientificName: string;
  cycle: number; // en jours
  description: string;
  characteristics: string[];
  imageUrl?: string;
};

export type Location = {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  area: number; // en hectares
  region: string;
  soilType: string;
};

export type Multiplier = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  region: string;
  registrationNumber: string;
  certificationDate: string;
  status: 'actif' | 'inactif' | 'suspendu';
};

export type SeedLot = {
  id: string;
  code: string;
  level: SeedLevel;
  variety: CropVariety;
  parentLot?: string; // ID du lot parent
  childLots?: string[]; // IDs des lots enfants
  productionDate: string;
  expiryDate: string;
  quantity: number; // en kg
  initialQuantity: number; // en kg
  location: Location;
  status: SeedStatus;
  purity: number; // pourcentage
  germination: number; // pourcentage
  moisture: number; // pourcentage
  producer: string; // ISRA ou ID du multiplicateur
  certificationNumber?: string;
  qrCode?: string;
  inspections: Inspection[];
  notes?: string;
};

export type Inspection = {
  id: string;
  lotId: string;
  date: string;
  inspector: string;
  type: 'au_champ' | 'laboratoire' | 'stockage';
  status: 'conforme' | 'non_conforme' | 'en_attente';
  observations: string;
  images?: string[];
  results?: {
    [key: string]: number | string;
  };
};

export type Distribution = {
  id: string;
  lotId: string;
  multiplier: Multiplier;
  quantity: number;
  date: string;
  expectedReturn: number; // quantité attendue en retour (G3/R1/R2)
  contractNumber: string;
  status: 'planifié' | 'distribué' | 'en_culture' | 'retourné' | 'annulé';
};

export type Dashboard = {
  totalSeedsInStock: number;
  seedsByLevel: {
    level: SeedLevel;
    quantity: number;
  }[];
  activeLots: number;
  activeMultipliers: number;
  upcomingInspections: number;
  lastDistributions: Distribution[];
  stockAlerts: {
    varietyId: string;
    varietyName: string;
    level: SeedLevel;
    currentStock: number;
    minimumRequired: number;
  }[];
};
