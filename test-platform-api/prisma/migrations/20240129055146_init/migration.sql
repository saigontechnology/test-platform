-- DropForeignKey
ALTER TABLE "Examination" DROP CONSTRAINT "Examination_assessmentId_fkey";

-- AddForeignKey
ALTER TABLE "Examination" ADD CONSTRAINT "Examination_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
