-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Powerstation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "capacityWh" INTEGER NOT NULL,
    "outputWatts" INTEGER NOT NULL,
    "surgeWatts" INTEGER NOT NULL,
    "batteryType" TEXT NOT NULL,
    "cycleLife" INTEGER NOT NULL,
    "chargeTimeAcMin" INTEGER NOT NULL,
    "solarInputMaxW" INTEGER NOT NULL,
    "upsMode" BOOLEAN NOT NULL DEFAULT false,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "portsAc" INTEGER NOT NULL,
    "portsUsbC" INTEGER NOT NULL,
    "portsUsbA" INTEGER NOT NULL,
    "portsDc12v" INTEGER NOT NULL,
    "priceApprox" DOUBLE PRECISION NOT NULL,
    "warrantyYears" INTEGER NOT NULL DEFAULT 2,
    "affiliateUrl" TEXT,
    "analysisText" TEXT,
    "pros" TEXT,
    "cons" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Powerstation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "avgWatts" INTEGER NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Powerstation_slug_key" ON "Powerstation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Device_slug_key" ON "Device"("slug");

-- AddForeignKey
ALTER TABLE "Powerstation" ADD CONSTRAINT "Powerstation_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
