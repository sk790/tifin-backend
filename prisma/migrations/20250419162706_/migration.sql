/*
  Warnings:

  - You are about to drop the column `userId` on the `Meal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_userId_fkey";

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "userId",
ADD COLUMN     "spId" INTEGER;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_spId_fkey" FOREIGN KEY ("spId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
