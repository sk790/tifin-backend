/*
  Warnings:

  - You are about to drop the column `address` on the `temporaryUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "quantity" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "temporaryUser" DROP COLUMN "address",
ADD COLUMN     "addressz" TEXT;
