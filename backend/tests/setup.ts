// backend/src/__tests__/setup.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL_TEST ||
        "postgresql://test:test@localhost:5432/isra_seeds_test",
    },
  },
});

beforeAll(async () => {
  // Connecter à la base de test
  await prisma.$connect();
});

afterAll(async () => {
  // Nettoyer et déconnecter
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Nettoyer les données entre chaque test
  const deleteOperations = [
    prisma.qualityControl.deleteMany(),
    prisma.productionActivity.deleteMany(),
    prisma.productionIssue.deleteMany(),
    prisma.weatherData.deleteMany(),
    prisma.production.deleteMany(),
    prisma.report.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.seedLot.deleteMany(),
    prisma.contract.deleteMany(),
    prisma.productionHistory.deleteMany(),
    prisma.soilAnalysis.deleteMany(),
    prisma.previousCrop.deleteMany(),
    prisma.parcel.deleteMany(),
    prisma.multiplier.deleteMany(),
    prisma.variety.deleteMany(),
    prisma.user.deleteMany(),
  ];

  await prisma.$transaction(deleteOperations);
});

export { prisma };
