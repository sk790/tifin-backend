-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('LUNCH', 'DINNER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SP', 'USER');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "orderQuantity" INTEGER NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "rating" DOUBLE PRECISION DEFAULT 0,
    "noOfReviews" INTEGER DEFAULT 0,

    CONSTRAINT "Sp_pkey" PRIMARY KEY ("id")
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
    "rating" DOUBLE PRECISION DEFAULT 0,
    "noOfReviews" INTEGER DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "spId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "mealId" INTEGER,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpReviews" (
    "id" SERIAL NOT NULL,
    "spId" INTEGER,
    "userId" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "SpReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mealType" "MealType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gst" DOUBLE PRECISION,
    "deliveryCharges" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "spId" INTEGER,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temporaryUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "role" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "otpExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temporaryUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Sp_phone_key" ON "Sp"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "temporaryUser_phone_key" ON "temporaryUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "temporaryUser_otp_key" ON "temporaryUser"("otp");

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Sp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_spId_fkey" FOREIGN KEY ("spId") REFERENCES "Sp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpReviews" ADD CONSTRAINT "SpReviews_spId_fkey" FOREIGN KEY ("spId") REFERENCES "Sp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_spId_fkey" FOREIGN KEY ("spId") REFERENCES "Sp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
