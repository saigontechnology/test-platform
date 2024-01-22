/*
  Warnings:

  - You are about to drop the column `answer` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "answer",
DROP COLUMN "description",
DROP COLUMN "options",
DROP COLUMN "type";
