-- CreateTable
CREATE TABLE "temporaryUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "otpExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temporaryUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "temporaryUser_phone_key" ON "temporaryUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "temporaryUser_otp_key" ON "temporaryUser"("otp");
