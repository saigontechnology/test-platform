/*
  Warnings:

  - You are about to drop the column `answer` on the `ExamAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExamAnswer" DROP COLUMN "answer",
ADD COLUMN     "selections" INTEGER[];
