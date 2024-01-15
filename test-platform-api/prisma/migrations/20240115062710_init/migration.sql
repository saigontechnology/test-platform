-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE');

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sentence" TEXT NOT NULL,
    "answer" TEXT,
    "type" "QuestionType" NOT NULL DEFAULT 'SINGLE_CHOICE',

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
