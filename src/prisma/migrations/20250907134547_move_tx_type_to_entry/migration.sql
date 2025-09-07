/*
  Warnings:

  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `type` to the `TransactionEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "public"."TransactionEntry" ADD COLUMN     "type" "public"."TransactionType" NOT NULL;
