export function calculateExamScored(
  assessmentInfo: any,
  examAnswers: any,
  candidateEmail: string,
) {
  let scored = 0;
  let correctQuestions = 0;

  assessmentInfo.assessmentQuestionMapping.forEach((item) => {
    const examAnswer = examAnswers.find(
      (answ) => answ.questionId === item.question.id,
    );
    if (item.question?.answer[0] == examAnswer.selections[0]) {
      scored += item.score;
      correctQuestions++;
    }
  });
  return {
    email: candidateEmail,
    scored,
    correctQuestions: correctQuestions,
  };
}
