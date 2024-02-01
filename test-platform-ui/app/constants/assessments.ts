const Level = {
  Junior: 'Junior',
  Intermediate: 'Intermediate',
  Senior: 'Senior',
};
export const LevelOptions = [
  {
    label: 'Junior',
    value: Level.Junior,
  },
  {
    label: 'Intermediate',
    value: Level.Intermediate,
  },
  {
    label: 'Senior',
    value: Level.Senior,
  },
];

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
}

export interface IQuestion {
  createdAt: string;
  question: {
    answer: number[];
    category: string;
    description: string;
    id: number;
    options: string[];
    question: string;
    type: QuestionType;
  };
}

export interface IAssessment {
  id: number;
  createdAt: Date;
  name: string;
  level: string;
  assessmentQuestionMapping: IQuestion[];
}

export interface ICreateAssessment {
  id?: string;
  name: string;
  level: string;
  questions?: string[];
}

export interface ILogInValidate {
  email: string;
}
