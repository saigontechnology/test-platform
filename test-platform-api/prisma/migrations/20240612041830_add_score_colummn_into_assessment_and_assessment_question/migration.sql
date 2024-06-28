/*
  Warnings:

  - Added the required column `score` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `AssessmentQuestionMapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "score" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AssessmentQuestionMapping" ADD COLUMN     "score" INTEGER NOT NULL;
