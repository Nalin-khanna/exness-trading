/*
  Warnings:

  - You are about to drop the `Stream` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Stream";

-- CreateTable
CREATE TABLE "public"."Trade" (
    "symbol" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "qty" TEXT NOT NULL,
    "Time" INTEGER NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("Time")
);
