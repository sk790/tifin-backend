/*
  Warnings:

  - You are about to drop the `Dinner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lunch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dinner" DROP CONSTRAINT "Dinner_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lunch" DROP CONSTRAINT "Lunch_userId_fkey";

-- DropTable
DROP TABLE "Dinner";

-- DropTable
DROP TABLE "Lunch";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" SERIAL NOT NULL,
    "day" "Day" NOT NULL DEFAULT 'SUNDAY',
    "mealType" "MealType" DEFAULT 'LUNCH',
    "sabji" TEXT NOT NULL DEFAULT '',
    "roti" INTEGER NOT NULL DEFAULT 1,
    "rice" TEXT NOT NULL DEFAULT '',
    "salad" BOOLEAN,
    "raita" BOOLEAN,
    "description" TEXT,
    "rating" INTEGER DEFAULT 0,
    "noOfReviews" INTEGER DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "mealId" INTEGER,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
