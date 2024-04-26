/*
  Warnings:

  - Added the required column `expireUtil` to the `Examination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Examination" ADD COLUMN     "expireUtil" TIMESTAMP(3) NOT NULL;
