
import { CropVariety, SeedLot, Multiplier, Location, Inspection, Distribution, Dashboard, SeedLevel } from '../types';

// Variétés de cultures
export const mockVarieties: CropVariety[] = [
  {
    id: 'var-001',
    name: 'Sahel 108',
    scientificName: 'Oryza sativa',
    cycle: 120,
    description: "Variété de riz à cycle court adaptée à la vallée du fleuve Sénégal",
    characteristics: ["Résistant à la sécheresse", "Haut rendement", "Grains longs"],
    imageUrl: "/placeholder.svg"
  },
  {
    id: 'var-002',
    name: 'Sahel 177',
    scientificName: 'Oryza sativa',
    cycle: 135,
    description: "Variété de riz très productive pour la culture irriguée",
    characteristics: ["Résistant aux maladies", "Tolérant à la salinité", "Grains parfumés"],
    imageUrl: "/placeholder.svg"
  },
  {
    id: 'var-003',
    name: 'Sahel 328',
    scientificName: 'Oryza sativa',
    cycle: 125,
    description: "Variété de riz améliorée pour les conditions sahéliennes",
    characteristics: ["Résistant à la verse", "Adapté aux sols pauvres", "Bon goût"],
    imageUrl: "/placeholder.svg"
  },
  {
    id: 'var-004',
    name: 'Nerica 4',
    scientificName: 'Oryza glaberrima × Oryza sativa',
    cycle: 115,
    description: "Hybride de riz africain et asiatique adapté aux conditions pluviales",
    characteristics: ["Très précoce", "Économe en eau", "Adapté à l'agriculture familiale"],
    imageUrl: "/placeholder.svg"
  },
  {
    id: 'var-005',
    name: 'Souna 3',
    scientificName: 'Pennisetum glaucum',
    cycle: 90,
    description: "Variété de mil à cycle court pour les zones sèches",
    characteristics: ["Ultra précoce", "Résistant au Striga", "Adapté aux sols sableux"],
    imageUrl: "/placeholder.svg"
  }
];

// Localisations
export const mockLocations: Location[] = [
  {
    id: 'loc-001',
    name: 'Parcelle A - Station ISRA Saint-Louis',
    coordinates: {
      latitude: 16.0232,
      longitude: -16.4834
    },
    area: 2.5,
    region: 'Saint-Louis',
    soilType: 'Argilo-limoneux'
  },
  {
    id: 'loc-002',
    name: 'Parcelle B - Station ISRA Saint-Louis',
    coordinates: {
      latitude: 16.0245,
      longitude: -16.4822
    },
    area: 3.2,
    region: 'Saint-Louis',
    soilType: 'Limoneux'
  },
  {
    id: 'loc-003',
    name: 'Ferme semencière de Boundoum',
    coordinates: {
      latitude: 16.3855,
      longitude: -16.3822
    },
    area: 5.0,
    region: 'Saint-Louis',
    soilType: 'Argilo-sableux'
  },
  {
    id: 'loc-004',
    name: 'Parcelle d\'isolement de Ross Béthio',
    coordinates: {
      latitude: 16.2678,
      longitude: -16.1333
    },
    area: 1.8,
    region: 'Saint-Louis',
    soilType: 'Argileux'
  },
  {
    id: 'loc-005',
    name: 'Station expérimentale de Fanaye',
    coordinates: {
      latitude: 16.5411,
      longitude: -15.2558
    },
    area: 4.2,
    region: 'Saint-Louis',
    soilType: 'Limoneux-argileux'
  }
];

// Multiplicateurs
export const mockMultipliers: Multiplier[] = [
  {
    id: 'mul-001',
    name: 'Coopérative Agrosem',
    phone: '+221 77 123 45 67',
    email: 'contact@agrosem.sn',
    address: 'Ross Béthio, Saint-Louis',
    region: 'Saint-Louis',
    registrationNumber: 'MS-SL-2018-001',
    certificationDate: '2018-03-15',
    status: 'actif'
  },
  {
    id: 'mul-002',
    name: 'GIE Natangué',
    phone: '+221 76 765 43 21',
    email: 'natangue@gmail.com',
    address: 'Dagana, Saint-Louis',
    region: 'Saint-Louis',
    registrationNumber: 'MS-SL-2019-015',
    certificationDate: '2019-05-22',
    status: 'actif'
  },
  {
    id: 'mul-003',
    name: 'Ferme Diama Semences',
    phone: '+221 70 111 22 33',
    address: 'Diama, Saint-Louis',
    region: 'Saint-Louis',
    registrationNumber: 'MS-SL-2017-008',
    certificationDate: '2017-11-30',
    status: 'actif'
  },
  {
    id: 'mul-004',
    name: 'Union des Producteurs de Podor',
    phone: '+221 78 888 99 00',
    email: 'upp@semences.sn',
    address: 'Podor, Saint-Louis',
    region: 'Saint-Louis',
    registrationNumber: 'MS-SL-2020-023',
    certificationDate: '2020-02-10',
    status: 'actif'
  },
  {
    id: 'mul-005',
    name: 'Ferme Moderne Walo',
    phone: '+221 77 444 55 66',
    address: 'Richard Toll, Saint-Louis',
    region: 'Saint-Louis',
    registrationNumber: 'MS-SL-2019-032',
    certificationDate: '2019-12-18',
    status: 'suspendu'
  }
];

// Inspections
export const mockInspections: Inspection[] = [
  {
    id: 'insp-001',
    lotId: 'lot-002',
    date: '2023-05-12',
    inspector: 'Mamadou Diallo',
    type: 'au_champ',
    status: 'conforme',
    observations: 'Parcelle bien entretenue, bon développement des plants',
    images: ['/placeholder.svg'],
    results: {
      'pureté variétale': '98%',
      'plants hors-types': '2%',
      'maladies': '0.5%'
    }
  },
  {
    id: 'insp-002',
    lotId: 'lot-003',
    date: '2023-06-18',
    inspector: 'Fatou Ndiaye',
    type: 'laboratoire',
    status: 'conforme',
    observations: 'Tests de germination et de pureté conformes aux standards',
    results: {
      'germination': '95%',
      'pureté': '99.2%',
      'humidité': '12.5%'
    }
  },
  {
    id: 'insp-003',
    lotId: 'lot-005',
    date: '2023-07-22',
    inspector: 'Ousmane Seck',
    type: 'stockage',
    status: 'non_conforme',
    observations: 'Problème d\'humidité dans le local de stockage. Risque de détérioration des semences.',
    results: {
      'température': '28°C',
      'humidité relative': '72%',
      'présence de nuisibles': 'Détectée'
    }
  },
  {
    id: 'insp-004',
    lotId: 'lot-004',
    date: '2023-08-05',
    inspector: 'Mamadou Diallo',
    type: 'au_champ',
    status: 'conforme',
    observations: 'Bonne isolation de la parcelle, floraison homogène',
    results: {
      'isolement': 'Suffisant',
      'homogénéité': 'Bonne',
      'adventices': 'Peu présentes'
    }
  },
  {
    id: 'insp-005',
    lotId: 'lot-001',
    date: '2023-09-11',
    inspector: 'Fatou Ndiaye',
    type: 'laboratoire',
    status: 'en_attente',
    observations: 'Attente des résultats de pureté spécifique',
    results: {
      'germination': '97%',
    }
  }
];

// Lots de semences
export const mockSeedLots: SeedLot[] = [
  {
    id: 'lot-001',
    code: 'GO-SL108-23-001',
    level: 'GO',
    variety: mockVarieties[0],
    productionDate: '2023-01-15',
    expiryDate: '2025-01-15',
    quantity: 12,
    initialQuantity: 15,
    location: mockLocations[0],
    status: 'en_stock',
    purity: 99.8,
    germination: 97,
    moisture: 11.5,
    producer: 'ISRA',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    inspections: [mockInspections[4]],
    notes: 'Lot initial obtenu après sélection variétale'
  },
  {
    id: 'lot-002',
    code: 'G1-SL108-23-001',
    level: 'G1',
    variety: mockVarieties[0],
    parentLot: 'lot-001',
    productionDate: '2023-05-20',
    expiryDate: '2025-05-20',
    quantity: 85,
    initialQuantity: 120,
    location: mockLocations[1],
    status: 'en_stock',
    purity: 99.5,
    germination: 96,
    moisture: 12.0,
    producer: 'ISRA',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    inspections: [mockInspections[0]],
    notes: 'Premier cycle de multiplication à partir du lot GO'
  },
  {
    id: 'lot-003',
    code: 'G2-SL108-23-001',
    level: 'G2',
    variety: mockVarieties[0],
    parentLot: 'lot-002',
    productionDate: '2023-06-30',
    expiryDate: '2025-06-30',
    quantity: 450,
    initialQuantity: 800,
    location: mockLocations[2],
    status: 'attribué',
    purity: 99.2,
    germination: 95,
    moisture: 12.5,
    producer: 'ISRA',
    certificationNumber: 'CERT-G2-2023-042',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    inspections: [mockInspections[1]],
    notes: 'Lot destiné aux multiplicateurs'
  },
  {
    id: 'lot-004',
    code: 'G1-SL177-23-001',
    level: 'G1',
    variety: mockVarieties[1],
    productionDate: '2023-04-10',
    expiryDate: '2025-04-10',
    quantity: 65,
    initialQuantity: 70,
    location: mockLocations[3],
    status: 'en_stock',
    purity: 99.6,
    germination: 98,
    moisture: 11.8,
    producer: 'ISRA',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    inspections: [mockInspections[3]],
    notes: 'Excellente qualité de semence'
  },
  {
    id: 'lot-005',
    code: 'G2-NR4-23-001',
    level: 'G2',
    variety: mockVarieties[3],
    productionDate: '2023-03-25',
    expiryDate: '2025-03-25',
    quantity: 320,
    initialQuantity: 500,
    location: mockLocations[4],
    status: 'en_production',
    purity: 98.9,
    germination: 94,
    moisture: 13.0,
    producer: 'ISRA',
    certificationNumber: 'CERT-G2-2023-038',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    inspections: [mockInspections[2]],
    notes: 'Attention à l\'humidité de stockage'
  },
  {
    id: 'lot-006',
    code: 'G3-SL108-23-001',
    level: 'G3',
    variety: mockVarieties[0],
    parentLot: 'lot-003',
    productionDate: '2023-10-12',
    expiryDate: '2025-10-12',
    quantity: 2800,
    initialQuantity: 3000,
    location: {
      id: 'ext-loc-001',
      name: 'Ferme Agrosem 1',
      coordinates: {
        latitude: 16.1245,
        longitude: -16.4322
      },
      area: 12.0,
      region: 'Saint-Louis',
      soilType: 'Argilo-limoneux'
    },
    status: 'certifié',
    purity: 98.8,
    germination: 93,
    moisture: 12.8,
    producer: 'mul-001',
    certificationNumber: 'CERT-G3-2023-105',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    inspections: [],
    notes: 'Multiplication réussie par Agrosem'
  }
];

// Distributions
export const mockDistributions: Distribution[] = [
  {
    id: 'dist-001',
    lotId: 'lot-003',
    multiplier: mockMultipliers[0],
    quantity: 200,
    date: '2023-07-15',
    expectedReturn: 5000,
    contractNumber: 'CONT-2023-0042',
    status: 'en_culture'
  },
  {
    id: 'dist-002',
    lotId: 'lot-003',
    multiplier: mockMultipliers[1],
    quantity: 150,
    date: '2023-07-20',
    expectedReturn: 3750,
    contractNumber: 'CONT-2023-0043',
    status: 'en_culture'
  },
  {
    id: 'dist-003',
    lotId: 'lot-005',
    multiplier: mockMultipliers[2],
    quantity: 180,
    date: '2023-04-10',
    expectedReturn: 4500,
    contractNumber: 'CONT-2023-0028',
    status: 'retourné'
  },
  {
    id: 'dist-004',
    lotId: 'lot-002',
    multiplier: mockMultipliers[3],
    quantity: 35,
    date: '2023-08-22',
    expectedReturn: 875,
    contractNumber: 'CONT-2023-0056',
    status: 'planifié'
  }
];

// Données pour le tableau de bord
export const mockDashboard: Dashboard = {
  totalSeedsInStock: 932,
  seedsByLevel: [
    { level: 'GO', quantity: 12 },
    { level: 'G1', quantity: 150 },
    { level: 'G2', quantity: 770 },
    { level: 'G3', quantity: 0 },
    { level: 'R1', quantity: 0 },
    { level: 'R2', quantity: 0 }
  ],
  activeLots: 5,
  activeMultipliers: 4,
  upcomingInspections: 2,
  lastDistributions: mockDistributions.slice(0, 3),
  stockAlerts: [
    {
      varietyId: 'var-003',
      varietyName: 'Sahel 328',
      level: 'G1',
      currentStock: 5,
      minimumRequired: 20
    },
    {
      varietyId: 'var-005',
      varietyName: 'Souna 3',
      level: 'GO',
      currentStock: 0,
      minimumRequired: 5
    }
  ]
};

// Fonction utilitaire pour obtenir une distribution par lot
export const getDistributionsByLotId = (lotId: string): Distribution[] => {
  return mockDistributions.filter(dist => dist.lotId === lotId);
};

// Fonction utilitaire pour obtenir un lot par ID
export const getSeedLotById = (id: string): SeedLot | undefined => {
  return mockSeedLots.find(lot => lot.id === id);
};

// Fonction utilitaire pour obtenir la généalogie d'un lot
export const getSeedLotGenealogy = (lotId: string): SeedLot[] => {
  const result: SeedLot[] = [];
  let currentLot = mockSeedLots.find(lot => lot.id === lotId);
  
  // Trouver tous les parents (ascendance)
  while (currentLot) {
    result.unshift(currentLot); // Ajouter au début
    if (currentLot.parentLot) {
      currentLot = mockSeedLots.find(lot => lot.id === currentLot?.parentLot);
    } else {
      break;
    }
  }
  
  // Si on ne commence pas au lot demandé (cas où on a remonté l'arbre)
  if (result[result.length - 1]?.id !== lotId) {
    currentLot = mockSeedLots.find(lot => lot.id === lotId);
    if (currentLot) {
      result.length = 0; // Vider le tableau
      result.push(currentLot);
    }
  }
  
  // Trouver tous les enfants (descendance)
  const findChildren = (parentId: string) => {
    const children = mockSeedLots.filter(lot => lot.parentLot === parentId);
    children.forEach(child => {
      result.push(child);
      findChildren(child.id);
    });
  };
  
  findChildren(lotId);
  
  return result;
};

// Fonction utilitaire pour obtenir les lots par niveau
export const getSeedLotsByLevel = (level: SeedLevel): SeedLot[] => {
  return mockSeedLots.filter(lot => lot.level === level);
};

// Fonction utilitaire pour obtenir les lots par variété
export const getSeedLotsByVariety = (varietyId: string): SeedLot[] => {
  return mockSeedLots.filter(lot => lot.variety.id === varietyId);
};
