-- AlterTable
ALTER TABLE "Daily_Reward"
ADD COLUMN "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "attempts_date" TIMESTAMP(3);
