import { QuestionType } from '@/libs/definitions';

export const Level = {
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

export enum AssessmentLevels {
  JUNIOR = 'JUNIOR',
  INTERMEDIATE = 'INTERMEDIATE',
  SENIOR = 'SENIOR',
  PRINCIPAL = 'PRINCIPAL',
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
    duration: number;
  };
}

export interface IAssessment {
  id: number;
  createdAt: Date;
  name: string;
  level: string;
  assessmentQuestionMapping: IQuestion[];
  error?: Error;
  duration: number;
  active?: boolean;
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
    level: string;
    answer: [number];
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
  durationTotal?: number;
  questionNumbers?: number;
  correctByLevel: ICorrectByLevel[];
}

export interface ICorrectByLevel {
  level: string;
  scored: number;
  total: number;
}
