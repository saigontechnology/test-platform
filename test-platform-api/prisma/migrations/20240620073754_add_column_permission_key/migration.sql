/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `UserPermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `UserPermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPermission" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_key_key" ON "UserPermission"("key");