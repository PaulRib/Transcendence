-- CreateTable
CREATE TABLE "DailyCountryMatch" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "DailyCountryMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyCountryMatch_date_key" ON "DailyCountryMatch"("date");

-- AddForeignKey
ALTER TABLE "DailyCountryMatch" ADD CONSTRAINT "DailyCountryMatch_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
