export function calculateExamScored(
  assessmentInfo: any,
  examAnswers: any,
  candidateEmail: string,
) {
  const numberCorrect = assessmentInfo.assessmentQuestionMapping
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
    scored: Number(((numberCorrect / examAnswers.length) * 100).toFixed(2)),
    correctQuestions: numberCorrect,
  };
}
