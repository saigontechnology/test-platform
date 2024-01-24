-- CreateEnum
CREATE TYPE "ExaminationStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'EVALUATED');

-- CreateTable
CREATE TABLE "Examination" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "score" DECIMAL(65,30),
    "status" "ExaminationStatus" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "Examination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAnswer" (
    "questionId" INTEGER NOT NULL,
    "answer" INTEGER[],
    "examinationId" INTEGER NOT NULL,

    CONSTRAINT "ExamAnswer_pkey" PRIMARY KEY ("questionId","examinationId")
);

-- AddForeignKey
ALTER TABLE "Examination" ADD CONSTRAINT "Examination_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_examinationId_fkey" FOREIGN KEY ("examinationId") REFERENCES "Examination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
