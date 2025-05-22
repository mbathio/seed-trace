// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Nettoyer la base de données
  await prisma.qualityControl.deleteMany();
  await prisma.productionActivity.deleteMany();
  await prisma.productionIssue.deleteMany();
  await prisma.weatherData.deleteMany();
  await prisma.production.deleteMany();
  await prisma.report.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.seedLot.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.productionHistory.deleteMany();
  await prisma.soilAnalysis.deleteMany();
  await prisma.previousCrop.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.multiplier.deleteMany();
  await prisma.variety.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Base de données nettoyée');

  // Créer les utilisateurs (MOCK_USERS du frontend)
  const hashedPassword = await bcrypt.hash('12345', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 1,
        name: 'Amadou Diop',
        email: 'adiop@isra.sn',
        password: hashedPassword,
        role: 'researcher',
        avatar: '/avatars/amadou.png'
      }
    }),
    prisma.user.create({
      data: {
        id: 2,
        name: 'Fatou Sy',
        email: 'fsy@isra.sn',
        password: hashedPassword,
        role: 'technician',
        avatar: '/avatars/fatou.png'
      }
    }),
    prisma.user.create({
      data: {
        id: 3,
        name: 'Moussa Kane',
        email: 'mkane@isra.sn',
        password: hashedPassword,
        role: 'manager',
        avatar: '/avatars/moussa.png'
      }
    }),
    prisma.user.create({
      data: {
        id: 4,
        name: 'Ousmane Ndiaye',
        email: 'ondiaye@isra.sn',
        password: hashedPassword,
        role: 'inspector'
      }
    }),
    prisma.user.create({
      data: {
        id: 5,
        name: 'Admin ISRA',
        email: 'admin@isra.sn',
        password: hashedPassword,
        role: 'admin'
      }
    })
  ]);

  console.log('👥 Utilisateurs créés:', users.length);

  // Créer les variétés (MOCK_VARIETIES du frontend)
  const varieties = await Promise.all([
    prisma.variety.create({
      data: {
        id: 'sahel108',
        name: 'Sahel 108',
        cropType: 'rice',
        description: 'Variété de cycle court (100-110 jours) adaptée aux zones irriguées du Nord',
        maturityDays: 105,
        yieldPotential: 9.5,
        resistances: ['Blast', 'Virus de la panachure jaune'],
        origin: 'AfricaRice',
        releaseYear: 1994
      }
    }),
    prisma.variety.create({
      data: {
        id: 'sahel202',
        name: 'Sahel 202',
        cropType: 'rice',
        description: 'Variété améliorée à haut rendement, bien adaptée aux conditions sahéliennes',
        maturityDays: 125,
        yieldPotential: 10.0,
        resistances: ['Blast', 'Pyriculariose'],
        origin: 'ISRA/AfricaRice',
        releaseYear: 2007
      }
    }),
    prisma.variety.create({
      data: {
        id: 'zm309',
        name: 'ZM309',
        cropType: 'maize',
        description: 'Variété de maïs tolérante à la sécheresse, adaptée aux zones semi-arides',
        maturityDays: 95,
        yieldPotential: 7.2,
        resistances: ['Streak', 'Rouille'],
        origin: 'IITA',
        releaseYear: 2012
      }
    }),
    prisma.variety.create({
      data: {
        id: '73-33',
        name: '73-33',
        cropType: 'peanut',
        description: 'Variété d\'arachide traditionnelle du Sénégal, bien adaptée aux zones sahéliennes',
        maturityDays: 90,
        yieldPotential: 3.5,
        resistances: [],
        origin: 'ISRA',
        releaseYear: 1973
      }
    })
  ]);

  console.log('🌾 Variétés créées:', varieties.length);

  // Créer les multiplicateurs
  const multipliers = await Promise.all([
    prisma.multiplier.create({
      data: {
        id: 1,
        name: 'Ibrahima Ba',
        status: 'active',
        address: 'Dagana, Saint-Louis',
        latitude: 16.5182,
        longitude: -15.5046,
        yearsExperience: 8,
        certificationLevel: 'expert',
        specialization: ['rice', 'maize'],
        phone: '77 123 45 67',
        email: 'ibrahima@example.com'
      }
    }),
    prisma.multiplier.create({
      data: {
        id: 2,
        name: 'Aminata Diallo',
        status: 'active',
        address: 'Podor, Saint-Louis',
        latitude: 16.6518,
        longitude: -14.9592,
        yearsExperience: 5,
        certificationLevel: 'intermediate',
        specialization: ['rice', 'peanut'],
        phone: '77 234 56 78',
        email: 'aminata@example.com'
      }
    }),
    prisma.multiplier.create({
      data: {
        id: 3,
        name: 'Mamadou Sow',
        status: 'inactive',
        address: 'Richard-Toll, Saint-Louis',
        latitude: 16.4625,
        longitude: -15.7009,
        yearsExperience: 10,
        certificationLevel: 'expert',
        specialization: ['rice', 'sorghum', 'millet']
      }
    }),
    prisma.multiplier.create({
      data: {
        id: 4,
        name: 'Aissatou Ndiaye',
        status: 'active',
        address: 'Matam',
        latitude: 15.6552,
        longitude: -13.2578,
        yearsExperience: 3,
        certificationLevel: 'beginner',
        specialization: ['maize', 'cowpea'],
        phone: '77 345 67 89'
      }
    })
  ]);

  console.log('👨‍🌾 Multiplicateurs créés:', multipliers.length);

  // Créer les parcelles
  const parcels = await Promise.all([
    prisma.parcel.create({
      data: {
        id: 1,
        name: 'Parcelle Dagana 01',
        area: 5.2,
        latitude: 16.5182,
        longitude: -15.5046,
        status: 'in_use',
        soilType: 'Argilo-limoneux',
        irrigationSystem: 'Goutte-à-goutte',
        address: 'Zone agricole de Dagana, Saint-Louis',
        multiplierId: 1
      }
    }),
    prisma.parcel.create({
      data: {
        id: 2,
        name: 'Parcelle Podor 02',
        area: 3.8,
        latitude: 16.6518,
        longitude: -14.9592,