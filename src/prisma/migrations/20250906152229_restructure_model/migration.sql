/*
  Warnings:

  - You are about to drop the column `beneficiaryId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `donorId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `donationId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TransactionEntry` table. All the data in the column will be lost.
  - The primary key for the `Wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `sourceType` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Wallet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionSource" AS ENUM ('DONATION', 'TRANSFER', 'AIRTIME', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_beneficiaryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_donorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_donationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionEntry" DROP CONSTRAINT "TransactionEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TransactionEntry" DROP CONSTRAINT "TransactionEntry_walletId_fkey";

-- DropIndex
DROP INDEX "public"."Donation_beneficiaryId_idx";

-- DropIndex
DROP INDEX "public"."Donation_donorId_idx";

-- DropIndex
DROP INDEX "public"."Transaction_donationId_key";

-- DropIndex
DROP INDEX "public"."TransactionEntry_userId_idx";

-- DropIndex
DROP INDEX "public"."User_email_idx";

-- DropIndex
DROP INDEX "public"."Wallet_userId_idx";

-- AlterTable
ALTER TABLE "public"."Donation" DROP COLUMN "beneficiaryId",
DROP COLUMN "donorId",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "donationId",
ADD COLUMN     "sourceType" "public"."TransactionSource" NOT NULL;

-- AlterTable
ALTER TABLE "public"."TransactionEntry" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Wallet" DROP CONSTRAINT "Wallet_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."Transfer" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TransactionEntry" ADD CONSTRAINT "TransactionEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
