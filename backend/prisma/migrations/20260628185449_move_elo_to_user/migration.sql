/*
  Warnings:

  - You are about to drop the column `elo_rating` on the `Daily_Reward` table. All the data in the column will be lost.
  - You are about to drop the column `points_earned` on the `Daily_Reward` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Country" ALTER COLUMN "population" DROP DEFAULT,
ALTER COLUMN "currency" DROP DEFAULT,
ALTER COLUMN "currencyName" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Daily_Reward" DROP COLUMN "elo_rating",
DROP COLUMN "points_earned";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "elo_rating" INTEGER NOT NULL DEFAULT 0;
