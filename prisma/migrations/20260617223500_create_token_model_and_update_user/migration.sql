/*
  Warnings:

  - You are about to drop the column `created_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expires_in` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `tokens` table. All the data in the column will be lost.
  - Added the required column `expiresIn` to the `tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "created_at",
DROP COLUMN "expires_in",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
