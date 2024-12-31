-- AlterTable
ALTER TABLE "User" ADD COLUMN     "noOfReviews" INTEGER DEFAULT 0,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "SpReviews" (
    "id" SERIAL NOT NULL,
    "spId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "SpReviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpReviews" ADD CONSTRAINT "SpReviews_spId_fkey" FOREIGN KEY ("spId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
