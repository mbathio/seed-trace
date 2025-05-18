import {
  PrismaClient,
  Role,
  SeedLevel,
  LotStatus,
  TestResult,
  ParcelStatus,
  ProductionStatus,
  MultiplierStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import QRService from "../src/services/qr.service";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début de l'alimentation de la base de données...");

  // Création des utilisateurs
  console.log("📝 Création des utilisateurs...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Créer un utilisateur de chaque rôle
  const users = await prisma.user.createMany({
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
        name: "Omar Ndiaye",
        email: "ondiaye@isra.sn",
        password: hashedPassword,
        role: Role.INSPECTOR,
      },
      {
        name: "Aissatou Fall",
        email: "afall@isra.sn",
        password: hashedPassword,
        role: Role.MULTIPLIER,
      },
      {
        name: "Moussa Kane",
        email: "mkane@isra.sn",
        password: hashedPassword,
        role: Role.MANAGER,
      },
      {
        name: "Admin Système",
        email: "admin@isra.sn",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${users.count} utilisateurs créés`);

  // Création des variétés de semences
  console.log("🌾 Création des variétés de semences...");
  const sahel108 = await prisma.seedVariety.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Sahel 108",
      description: "Variété de riz à haut rendement adaptée au climat sahélien",
      origin: "ISRA Saint-Louis",
      creationDate: new Date("2018-03-15"),
    },
  });

  const sahel201 = await prisma.seedVariety.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Sahel 201",
      description: "Variété de riz résistante à la sécheresse",
      origin: "ISRA Saint-Louis",
      creationDate: new Date("2019-05-20"),
    },
  });

  const sahel202 = await prisma.seedVariety.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Sahel 202",
      description: "Variété de riz à cycle court et tolérant la salinité",
      origin: "ISRA Saint-Louis",
      creationDate: new Date("2020-07-10"),
    },
  });

  const nerica = await prisma.seedVariety.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Nerica 4",
      description: "Variété de riz pluvial à haute productivité",
      origin: "AfricaRice/ISRA",
      creationDate: new Date("2017-06-22"),
    },
  });

  console.log("✅ Variétés de semences créées");

  // Création des parcelles
  console.log("🏞️ Création des parcelles...");
  const parcels = await prisma.parcel.createMany({
    data: [
      {
        code: "P001",
        latitude: 16.0283,
        longitude: -16.507,
        area: 5.2,
        soilType: "Limoneux",
        status: ParcelStatus.AVAILABLE,
      },
      {
        code: "P002",
        latitude: 16.0315,
        longitude: -16.5103,
        area: 3.8,
        soilType: "Argileux",
        status: ParcelStatus.AVAILABLE,
      },
      {
        code: "P003",
        latitude: 16.0252,
        longitude: -16.5092,
        area: 4.5,
        soilType: "Sableux",
        status: ParcelStatus.AVAILABLE,
      },
      {
        code: "P004",
        latitude: 16.0291,
        longitude: -16.5021,
        area: 6.1,
        soilType: "Limoneux-argileux",
        status: ParcelStatus.AVAILABLE,
      },
      {
        code: "P005",
        latitude: 16.0327,
        longitude: -16.5064,
        area: 2.9,
        soilType: "Sableux-limoneux",
        status: ParcelStatus.AVAILABLE,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${parcels.count} parcelles créées`);

  // Création des multiplicateurs
  console.log("👨‍🌾 Création des multiplicateurs...");
  const multipliers = await prisma.multiplier.createMany({
    data: [
      {
        name: "Coopérative Agricole de Dagana",
        address: "Route Nationale, Dagana",
        phone: "77 123 45 67",
        email: "coop.dagana@example.com",
        status: MultiplierStatus.ACTIVE,
      },
      {
        name: "GIE des Producteurs de Richard-Toll",
        address: "Zone Agricole, Richard-Toll",
        phone: "78 234 56 78",
        email: "gie.richardtoll@example.com",
        status: MultiplierStatus.ACTIVE,
      },
      {
        name: "Union des Producteurs de Rosso",
        address: "Quartier Rosso 1, Rosso",
        phone: "76 345 67 89",
        email: "union.rosso@example.com",
        status: MultiplierStatus.ACTIVE,
      },
      {
        name: "Association Paysanne de Podor",
        address: "BP 234, Podor",
        phone: "77 456 78 90",
        email: "assoc.podor@example.com",
        status: MultiplierStatus.INACTIVE,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${multipliers.count} multiplicateurs créés`);

  // Création des lots de semences
  console.log("📦 Création des lots de semences...");

  // Lot GO pour Sahel 108
  const qrCodeGO = await QRService.generateSeedLotQR(
    "SL-GO-2023-001",
    sahel108.name,
    SeedLevel.GO,
    new Date("2023-01-15")
  );

  const lotGO = await prisma.seedLot.upsert({
    where: { id: "SL-GO-2023-001" },
    update: {},
    create: {
      id: "SL-GO-2023-001",
      varietyId: sahel108.id,
      level: SeedLevel.GO,
      quantity: 50,
      productionDate: new Date("2023-01-15"),
      status: LotStatus.ACTIVE,
      qrCode: qrCodeGO,
    },
  });

  // Lot G1 dérivé du GO
  const qrCodeG1 = await QRService.generateSeedLotQR(
    "SL-G1-2023-001",
    sahel108.name,
    SeedLevel.G1,
    new Date("2023-06-20")
  );

  const lotG1 = await prisma.seedLot.upsert({
    where: { id: "SL-G1-2023-001" },
    update: {},
    create: {
      id: "SL-G1-2023-001",
      varietyId: sahel108.id,
      parentLotId: lotGO.id,
      level: SeedLevel.G1,
      quantity: 250,
      productionDate: new Date("2023-06-20"),
      status: LotStatus.ACTIVE,
      qrCode: qrCodeG1,
    },
  });

  // Lot G2 dérivé du G1
  const qrCodeG2 = await QRService.generateSeedLotQR(
    "SL-G2-2023-001",
    sahel108.name,
    SeedLevel.G2,
    new Date("2023-11-10")
  );

  const lotG2 = await prisma.seedLot.upsert({
    where: { id: "SL-G2-2023-001" },
    update: {},
    create: {
      id: "SL-G2-2023-001",
      varietyId: sahel108.id,
      parentLotId: lotG1.id,
      level: SeedLevel.G2,
      quantity: 1200,
      productionDate: new Date("2023-11-10"),
      status: LotStatus.ACTIVE,
      qrCode: qrCodeG2,
    },
  });

  // Autres lots pour différentes variétés
  // Sahel 201
  const qrCodeSahel201GO = await QRService.generateSeedLotQR(
    "SL-GO-2023-002",
    sahel201.name,
    SeedLevel.GO,
    new Date("2023-02-10")
  );

  const lotSahel201GO = await prisma.seedLot.upsert({
    where: { id: "SL-GO-2023-002" },
    update: {},
    create: {
      id: "SL-GO-2023-002",
      varietyId: sahel201.id,
      level: SeedLevel.GO,
      quantity: 45,
      productionDate: new Date("2023-02-10"),
      status: LotStatus.ACTIVE,
      qrCode: qrCodeSahel201GO,
    },
  });

  // Nerica 4
  const qrCodeNericaGO = await QRService.generateSeedLotQR(
    "SL-GO-2023-003",
    nerica.name,
    SeedLevel.GO,
    new Date("2023-03-05")
  );

  const lotNericaGO = await prisma.seedLot.upsert({
    where: { id: "SL-GO-2023-003" },
    update: {},
    create: {
      id: "SL-GO-2023-003",
      varietyId: nerica.id,
      level: SeedLevel.GO,
      quantity: 60,
      productionDate: new Date("2023-03-05"),
      status: LotStatus.ACTIVE,
      qrCode: qrCodeNericaGO,
    },
  });

  console.log("✅ Lots de semences créés");

  // Création des contrôles de qualité
  console.log("🔍 Création des contrôles de qualité...");

  const qualityControls = await prisma.qualityControl.createMany({
    data: [
      {
        lotId: lotGO.id,
        controlDate: new Date("2023-01-20"),
        germinationRate: 98.5,
        varietyPurity: 99.9,
        result: TestResult.PASS,
        observations: "Excellente qualité, conforme aux standards GO",
      },
      {
        lotId: lotG1.id,
        controlDate: new Date("2023-06-25"),
        germinationRate: 95.2,
        varietyPurity: 99.4,
        result: TestResult.PASS,
        observations: "Qualité satisfaisante pour G1",
      },
      {
        lotId: lotG2.id,
        controlDate: new Date("2023-11-15"),
        germinationRate: 93.8,
        varietyPurity: 98.7,
        result: TestResult.PASS,
        observations: "Bonne qualité, conforme aux attentes",
      },
      {
        lotId: lotSahel201GO.id,
        controlDate: new Date("2023-02-15"),
        germinationRate: 97.9,
        varietyPurity: 99.8,
        result: TestResult.PASS,
        observations: "Excellente qualité pour cette variété",
      },
      {
        lotId: lotG1.id,
        controlDate: new Date("2023-07-10"),
        germinationRate: 85.3,
        varietyPurity: 97.5,
        result: TestResult.FAIL,
        observations: "Taux de germination inférieur aux normes G1, à vérifier",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${qualityControls.count} contrôles de qualité créés`);

  // Création des productions
  console.log("🌿 Création des productions...");

  // Récupérer les IDs des parcelles
  const [parcel1, parcel2, parcel3] = await prisma.parcel.findMany({
    take: 3,
    orderBy: { id: "asc" },
  });

  const productions = await prisma.production.createMany({
    data: [
      {
        lotId: lotG1.id,
        parcelId: parcel1.id,
        sowingDate: new Date("2023-03-10"),
        harvestDate: new Date("2023-06-20"),
        yield: 250,
        conditions: "Conditions optimales, bonne pluviométrie",
        status: ProductionStatus.COMPLETED,
      },
      {
        lotId: lotG2.id,
        parcelId: parcel2.id,
        sowingDate: new Date("2023-08-05"),
        harvestDate: new Date("2023-11-10"),
        yield: 1200,
        conditions: "Conditions favorables, irrigation suffisante",
        status: ProductionStatus.COMPLETED,
      },
      {
        lotId: lotSahel201GO.id,
        parcelId: parcel3.id,
        sowingDate: new Date("2023-01-15"),
        harvestDate: new Date("2023-02-10"),
        yield: 45,
        conditions: "Parcelle expérimentale, suivi intensif",
        status: ProductionStatus.COMPLETED,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${productions.count} productions créées`);

  // Mise à jour des statuts des parcelles utilisées pour la production
  await prisma.parcel.update({
    where: { id: parcel1.id },
    data: { status: ParcelStatus.RESTING },
  });

  await prisma.parcel.update({
    where: { id: parcel2.id },
    data: { status: ParcelStatus.RESTING },
  });

  await prisma.parcel.update({
    where: { id: parcel3.id },
    data: { status: ParcelStatus.RESTING },
  });

  // Création de distributions de lots
  console.log("📋 Création des distributions de lots...");

  // Récupérer les IDs des multiplicateurs
  const [multiplicateur1, multiplicateur2] = await prisma.multiplier.findMany({
    take: 2,
    orderBy: { id: "asc" },
  });

  const distributions = await prisma.distributedLot.createMany({
    data: [
      {
        lotId: lotG2.id,
        multiplierId: multiplicateur1.id,
        quantity: 500,
        distributionDate: new Date("2023-12-15"),
      },
      {
        lotId: lotG2.id,
        multiplierId: multiplicateur2.id,
        quantity: 400,
        distributionDate: new Date("2023-12-20"),
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${distributions.count} distributions créées`);

  // Mise à jour des quantités des lots distribués
  await prisma.seedLot.update({
    where: { id: lotG2.id },
    data: { quantity: 300 }, // 1200 - 500 - 400 = 300
  });

  console.log("🎉 Base de données alimentée avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de l'alimentation de la base de données:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
