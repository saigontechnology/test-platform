-- DropForeignKey
ALTER TABLE "AssessmentQuestionMapping" DROP CONSTRAINT "AssessmentQuestionMapping_assessmentId_fkey";

-- AddForeignKey
ALTER TABLE "AssessmentQuestionMapping" ADD CONSTRAINT "AssessmentQuestionMapping_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
