/*
  Warnings:

  - Added the required column `beneficiaryId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donorId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recepientId` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Donation" ADD COLUMN     "beneficiaryId" TEXT NOT NULL,
ADD COLUMN     "donorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transfer" ADD COLUMN     "recepientId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Donation_donorId_idx" ON "public"."Donation"("donorId");

-- CreateIndex
CREATE INDEX "Donation_beneficiaryId_idx" ON "public"."Donation"("beneficiaryId");

-- CreateIndex
CREATE INDEX "Transfer_senderId_idx" ON "public"."Transfer"("senderId");

-- CreateIndex
CREATE INDEX "Transfer_recepientId_idx" ON "public"."Transfer"("recepientId");

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_recepientId_fkey" FOREIGN KEY ("recepientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
