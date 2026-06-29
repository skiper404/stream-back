/*
  Warnings:

  - You are about to drop the column `created_at` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail_url` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `social_links` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `social_links` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `streams` table. All the data in the column will be lost.
  - Added the required column `thumbnailUrl` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `social_links` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "streams" DROP CONSTRAINT "streams_category_id_fkey";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "created_at",
DROP COLUMN "thumbnail_url",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "social_links" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "streams" DROP COLUMN "category_id",
ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
