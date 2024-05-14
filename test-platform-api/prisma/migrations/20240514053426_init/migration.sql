-- CreateEnum
CREATE TYPE "QuestionLevel" AS ENUM ('JUNIOR', 'INTERMEDIATE', 'SENIOR', 'PRINCIPAL');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "level" "QuestionLevel" NOT NULL DEFAULT 'JUNIOR';
