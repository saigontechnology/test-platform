import { QuestionType } from '@/libs/definitions';

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

export const QuestionTypeOptions = [
  {
    label: 'Single choice',
    value: QuestionType.SINGLE_CHOICE,
  },
  {
    label: 'Multiple choice',
    value: QuestionType.MULTIPLE_CHOICE,
  },
  {
    label: 'Coding',
    value: QuestionType.CODING,
  },
  {
    label: 'Logic',
    value: QuestionType.LOGIC,
  },
];

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
  error?: Error;
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

/** Assessment Interfaces */
export interface IExamAnswer {
  question: {
    question: string;
    options: string[];
  };
  selections: number[];
}

export interface IExamInfo {
  name: string;
  level: string;
}
export interface IExamination {
  id: number;
  email: string;
  score: number | null;
  status: string;
  createdAt: Date;
  assessmentId: number;
  assessment: IExamInfo;
  submittedAnswers: IExamAnswer[];
  expireUtil: string;
  empCode: string;
}
