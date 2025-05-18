import { PrismaClient, Role, SeedLevel, LotStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Création des utilisateurs
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Amadou Diop",
        email: "adiop@isra.sn",
        password: hashedPassword,
        role: Role.RESEARCHER,
      },
      {
        name: "Fatou Sy",
        email: "fsy@isra.sn",
        password: hashedPassword,
        role: Role.TECHNICIAN,
      },
      {
        name: "Moussa Kane",
        email: "mkane@isra.sn",
        password: hashedPassword,
        role: Role.MANAGER,
      },
    ],
  });

  // Création des variétés de semences
  const sahel108 = await prisma.seedVariety.create({
    data: {
      name: "Sahel 108",
      description: "Variété de riz à haut rendement adaptée au climat sahélien",
      origin: "ISRA Saint-Louis",
      creationDate: new Date("2018-03-15"),
    },
  });

  const sahel201 = await prisma.seedVariety.create({
    data: {
      name: "Sahel 201",
      description: "Variété de riz résistante à la sécheresse",
      origin: "ISRA Saint-Louis",
      creationDate: new Date("2019-05-20"),
    },
  });

  // Création des lots de semences
  const lotGO = await prisma.seedLot.create({
    data: {
      id: "SL-GO-2023-001",
      varietyId: sahel108.id,
      level: SeedLevel.GO,
      quantity: 50,
      productionDate: new Date("2023-01-15"),
      status: LotStatus.ACTIVE,
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SL-GO-2023-001",
    },
  });

  await prisma.seedLot.create({
    data: {
      id: "SL-G1-2023-001",
      varietyId: sahel108.id,
      parentLotId: lotGO.id,
      level: SeedLevel.G1,
      quantity: 250,
      productionDate: new Date("2023-06-20"),
      status: LotStatus.ACTIVE,
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SL-G1-2023-001",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
