-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "flagUrl" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_countryId_key" ON "Country"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Daily_Reward_user_id_key" ON "Daily_Reward"("user_id");
