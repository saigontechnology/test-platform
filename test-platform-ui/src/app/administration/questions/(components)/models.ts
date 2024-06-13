import { QuestionType } from '@/libs/definitions';

export interface ICreateQuestion {
  questionData: IQuestionInfo;
  onClose: () => void;
}
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export interface IQuestionInfo {
  id: number;
  question: string;
  description: string;
  notes?: string;
  level: string;
  categories: string[];
  category: string;
  answers: number[];
  options: string[];
  type: QuestionType;
  isModified: boolean;
  duration: number;
}

export interface IAnswer {
  id: string;
  answer: string;
  isCorrect: boolean;
}

export const manualErrors = [
  {
    type: 'manual',
    name: 'answers',
    description: 'Error incase selected answers',
    message:
      'Selected answer(s) is not default correct answer(s). Please add explanation incase you ensure selected is correct answer(s) !',
  },
  {
    type: 'minLength',
    name: 'root',
    description: 'Error incase none selected answers',
    message: 'At least one checkbox has been checked',
  },
];
