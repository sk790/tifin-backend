/*
  Warnings:

  - You are about to drop the column `spId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `spId` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the `Sp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_spId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_spId_fkey";

-- DropForeignKey
ALTER TABLE "SpReviews" DROP CONSTRAINT "SpReviews_spId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "spId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "spId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "noOfReviews" INTEGER DEFAULT 0,
ADD COLUMN     "orderQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Sp";

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpReviews" ADD CONSTRAINT "SpReviews_spId_fkey" FOREIGN KEY ("spId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
