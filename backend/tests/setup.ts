// backend/src/__tests__/setup.ts
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Charger les variables d'environnement pour les tests
config({ path: ".env.test" });

// Créer une instance Prisma pour les tests
const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL_TEST ||
        process.env.DATABASE_URL ||
        "postgresql://postgres:postgres@localhost:5432/isra_seeds_test",
    },
  },
});

// Augmenter le timeout pour les tests de base de données
jest.setTimeout(30000);

// Mock des services externes
jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Configuration globale avant tous les tests
beforeAll(async () => {
  try {
    // Connecter à la base de données de test
    await prisma.$connect();
    console.log("✅ Connected to test database");
  } catch (error) {
    console.error("❌ Failed to connect to test database:", error);
    process.exit(1);
  }
});

// Configuration globale après tous les tests
afterAll(async () => {
  try {
    // Déconnecter de la base de données
    await prisma.$disconnect();
    console.log("✅ Disconnected from test database");
  } catch (error) {
    console.error("❌ Failed to disconnect from test database:", error);
  }
});

// Nettoyer la base de données avant chaque test
beforeEach(async () => {
  // Nettoyer les tables dans le bon ordre (respecter les contraintes de clés étrangères)
  const tablesToClean = [
    // D'abord les tables qui dépendent d'autres tables
    "qualityControl",
    "productionActivity",
    "activityInput",
    "productionIssue",
    "weatherData",
    "production",
    "report",
    "refreshToken",
    "seedLot",
    "contract",
    "productionHistory",
    "soilAnalysis",
    "previousCrop",
    "parcel",
    "multiplier",
    "variety",
    "user",
  ];

  try {
    // Désactiver temporairement les contraintes de clés étrangères
    await prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`);

    // Nettoyer chaque table
    for (const table of tablesToClean) {
      await prisma[table].deleteMany({});
    }

    // Réactiver les contraintes
    await prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`);
  } catch (error) {
    console.error("Error cleaning database:", error);
  }
});

// Exporter prisma pour utilisation dans les tests
export { prisma };

// Helpers pour les tests
export const createTestUser = async (data: any = {}) => {
  return prisma.user.create({
    data: {
      name: data.name || "Test User",
      email: data.email || "test@example.com",
      password: data.password || "$2b$12$hashed_password",
      role: data.role || "TECHNICIAN",
      ...data,
    },
  });
};

export const createTestVariety = async (data: any = {}) => {
  return prisma.variety.create({
    data: {
      code: data.code || "TEST001",
      name: data.name || "Test Variety",
      cropType: data.cropType || "RICE",
      maturityDays: data.maturityDays || 120,
      ...data,
    },
  });
};

export const createTestMultiplier = async (data: any = {}) => {
  return prisma.multiplier.create({
    data: {
      name: data.name || "Test Multiplier",
      status: data.status || "ACTIVE",
      address: data.address || "Test Address",
      latitude: data.latitude || 16.5,
      longitude: data.longitude || -15.5,
      yearsExperience: data.yearsExperience || 5,
      certificationLevel: data.certificationLevel || "INTERMEDIATE",
      specialization: data.specialization || ["RICE"],
      ...data,
    },
  });
};

export const createTestSeedLot = async (data: any = {}) => {
  // Créer les dépendances si nécessaire
  const variety = data.varietyId
    ? null
    : await createTestVariety({ code: `VAR${Date.now()}` });

  const multiplier = data.multiplierId
    ? null
    : await createTestMultiplier({ name: `Mult${Date.now()}` });

  return prisma.seedLot.create({
    data: {
      id: data.id || `SL-G1-${Date.now()}`,
      varietyId: data.varietyId || variety!.id,
      level: data.level || "G1",
      quantity: data.quantity || 1000,
      productionDate: data.productionDate || new Date(),
      multiplierId: data.multiplierId || multiplier!.id,
      status: data.status || "PENDING",
      ...data,
    },
    include: {
      variety: true,
      multiplier: true,
    },
  });
};

// Utilitaires pour les tests d'API
export const mockRequest = (data: any = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: null,
  ...data,
});

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();

// Variables d'environnement pour les tests
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.BCRYPT_SALT_ROUNDS = "4"; // Moins de rounds pour des tests plus rapides
