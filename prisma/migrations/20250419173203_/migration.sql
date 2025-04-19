/*
  Warnings:

  - You are about to drop the column `deliveryCharges` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `gst` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryCharges",
DROP COLUMN "gst",
ADD COLUMN     "mealId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
