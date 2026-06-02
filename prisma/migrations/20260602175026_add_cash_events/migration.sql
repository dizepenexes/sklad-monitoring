-- CreateEnum
CREATE TYPE "CashEventType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "CashEventCategory" AS ENUM ('LOCAL_SALE', 'DELIVERY_ORDER', 'DEBT_RETURN', 'SALARY', 'OTHER');

-- CreateTable
CREATE TABLE "CashDay" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashEvent" (
    "id" TEXT NOT NULL,
    "cashDayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CashEventType" NOT NULL,
    "category" "CashEventCategory" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashEventItem" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtSale" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CashEventItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CashDay_date_key" ON "CashDay"("date");

-- AddForeignKey
ALTER TABLE "CashEvent" ADD CONSTRAINT "CashEvent_cashDayId_fkey" FOREIGN KEY ("cashDayId") REFERENCES "CashDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashEvent" ADD CONSTRAINT "CashEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashEventItem" ADD CONSTRAINT "CashEventItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "CashEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashEventItem" ADD CONSTRAINT "CashEventItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
