-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RESEARCHER', 'TECHNICIAN', 'MULTIPLIER', 'INSPECTOR', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SeedLevel" AS ENUM ('GO', 'G1', 'G2', 'G3', 'R1', 'R2');

-- CreateEnum
CREATE TYPE "LotStatus" AS ENUM ('ACTIVE', 'DISTRIBUTED', 'ELIMINATED');

-- CreateEnum
CREATE TYPE "TestResult" AS ENUM ('PASS', 'FAIL');

-- CreateEnum
CREATE TYPE "ParcelStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'RESTING');

-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('PLANNING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MultiplierStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TECHNICIAN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedVariety" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "origin" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedVariety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeedLot" (
    "id" TEXT NOT NULL,
    "varietyId" INTEGER NOT NULL,
    "parentLotId" TEXT,
    "level" "SeedLevel" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "productionDate" TIMESTAMP(3) NOT NULL,
    "status" "LotStatus" NOT NULL DEFAULT 'ACTIVE',
    "qrCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeedLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityControl" (
    "id" SERIAL NOT NULL,
    "lotId" TEXT NOT NULL,
    "controlDate" TIMESTAMP(3) NOT NULL,
    "germinationRate" DOUBLE PRECISION NOT NULL,
    "varietyPurity" DOUBLE PRECISION NOT NULL,
    "result" "TestResult" NOT NULL,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "soilType" TEXT,
    "status" "ParcelStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Production" (
    "id" SERIAL NOT NULL,
    "lotId" TEXT NOT NULL,
    "parcelId" INTEGER NOT NULL,
    "sowingDate" TIMESTAMP(3) NOT NULL,
    "harvestDate" TIMESTAMP(3),
    "yield" DOUBLE PRECISION,
    "conditions" TEXT,
    "status" "ProductionStatus" NOT NULL DEFAULT 'PLANNING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Production_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Multiplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "status" "MultiplierStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Multiplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributedLot" (
    "id" SERIAL NOT NULL,
    "lotId" TEXT NOT NULL,
    "multiplierId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "distributionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistributedLot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SeedLot" ADD CONSTRAINT "SeedLot_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "SeedVariety"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeedLot" ADD CONSTRAINT "SeedLot_parentLotId_fkey" FOREIGN KEY ("parentLotId") REFERENCES "SeedLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityControl" ADD CONSTRAINT "QualityControl_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "SeedLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "SeedLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Production" ADD CONSTRAINT "Production_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributedLot" ADD CONSTRAINT "DistributedLot_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "SeedLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributedLot" ADD CONSTRAINT "DistributedLot_multiplierId_fkey" FOREIGN KEY ("multiplierId") REFERENCES "Multiplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
