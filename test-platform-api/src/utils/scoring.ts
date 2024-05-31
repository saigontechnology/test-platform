export function calculateExamScored(
  assessmentInfo: any,
  examAnswers: any,
  candidateEmail: string,
) {
  let numberCorrect = 0;

  assessmentInfo.assessmentQuestionMapping.map((item) => {
    const examAnswer = examAnswers.find(
      (answ) => answ.questionId === item.question.id,
    );
    if (item.question?.answer[0] == examAnswer.selections[0]) {
      numberCorrect += 1;
    }
  });
  return {
    email: candidateEmail,
    scored: Number(((numberCorrect / examAnswers.length) * 100).toFixed(2)),
    correctQuestions: numberCorrect,
  };
}
