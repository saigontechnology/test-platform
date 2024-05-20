export interface IExamAnswer {
  questionId: number;
  selections: number[];
}

export interface ISubmitExamPayload {
  examId: string;
  email: string;
  assessmentId: number;
  selections: IExamAnswer[];
}
