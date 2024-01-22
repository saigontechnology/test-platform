-- DropForeignKey
ALTER TABLE "AssessmentQuestionMapping" DROP CONSTRAINT "AssessmentQuestionMapping_questionId_fkey";

-- AddForeignKey
ALTER TABLE "AssessmentQuestionMapping" ADD CONSTRAINT "AssessmentQuestionMapping_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
