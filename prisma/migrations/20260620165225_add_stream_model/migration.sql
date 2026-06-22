/*
  Warnings:

  - You are about to drop the column `created_at` on the `streams` table. All the data in the column will be lost.
  - You are about to drop the column `ingress_id` on the `streams` table. All the data in the column will be lost.
  - You are about to drop the column `server_url` on the `streams` table. All the data in the column will be lost.
  - You are about to drop the column `stream_key` on the `streams` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_url` on the `streams` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `streams` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `streams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ingressId]` on the table `streams` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `streams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `streams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "streams" DROP CONSTRAINT "streams_user_id_fkey";

-- DropIndex
DROP INDEX "streams_ingress_id_key";

-- DropIndex
DROP INDEX "streams_user_id_key";

-- AlterTable
ALTER TABLE "streams" DROP COLUMN "created_at",
DROP COLUMN "ingress_id",
DROP COLUMN "server_url",
DROP COLUMN "stream_key",
DROP COLUMN "thumbnail_url",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ingressId" TEXT,
ADD COLUMN     "serverUrl" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "streams_ingressId_key" ON "streams"("ingressId");

-- CreateIndex
CREATE UNIQUE INDEX "streams_userId_key" ON "streams"("userId");

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
