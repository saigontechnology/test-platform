export async function CalculateExamScored(
  assessmentInfo: any,
  examAnswers: any,
  candidateEmail: string,
) {
  const numberCorrect = await assessmentInfo.assessmentQuestionMapping
    .map((question) => {
      const exam_answers = examAnswers.find((answ) => answ.questionId)
        ?.selections;
      return (
        JSON.stringify(exam_answers) ===
        JSON.stringify(question.question.answer)
      );
    })
    .filter(Boolean).length;
  return {
    email: candidateEmail,
    scored: (numberCorrect / examAnswers.length) * 100,
  };
}
