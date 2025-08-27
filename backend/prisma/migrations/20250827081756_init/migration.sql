-- CreateTable
CREATE TABLE "public"."Stream" (
    "symbol" TEXT NOT NULL,
    "bid_price" TEXT NOT NULL,
    "bid_qty" TEXT NOT NULL,
    "ask_price" TEXT NOT NULL,
    "ask_qty" TEXT NOT NULL,
    "T" INTEGER NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("T")
);
