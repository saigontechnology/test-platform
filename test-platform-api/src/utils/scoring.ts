export function calculateExamScored(
  assessmentInfo: any,
  examAnswers: any,
  candidateEmail: string,
) {
  const numberCorrect = assessmentInfo.assessmentQuestionMapping
    .map((item) => {
      const examAnswer = examAnswers.find((answ) => answ.questionId);
      return item.question?.answer[0] === examAnswer.selections[0];
    })
    .filter(Boolean).length;
  return {
    email: candidateEmail,
    scored: Number(((numberCorrect / examAnswers.length) * 100).toFixed(2)),
    correctQuestions: numberCorrect,
  };
}
