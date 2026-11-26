/*
  Warnings:

  - A unique constraint covering the columns `[instagramMediaId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "instagramContainerId" TEXT,
ADD COLUMN     "instagramMediaId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_instagramMediaId_key" ON "Post"("instagramMediaId");
