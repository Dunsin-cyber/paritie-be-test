/*
  Warnings:

  - Added the required column `userId` to the `TransactionEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TransactionEntry" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TransactionEntry_userId_idx" ON "public"."TransactionEntry"("userId");

-- AddForeignKey
ALTER TABLE "public"."TransactionEntry" ADD CONSTRAINT "TransactionEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
