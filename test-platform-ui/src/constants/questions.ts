import { QuestionType } from '@/libs/definitions';

enum Category {
  React,
  Typescript,
  Javascript,
  Golang,
  ReactNative,
}
export const CategoriesOptions = [
  {
    label: 'React',
    value: Category.React,
  },
  {
    label: 'React Native',
    value: Category.ReactNative,
  },
  {
    label: 'Typescript',
    value: Category.React,
  },
  {
    label: 'Javascript',
    value: Category.Javascript,
  },
  {
    label: 'Golang',
    value: Category.Golang,
  },
];

export interface IAddQuestion {
  level: string;
  categories: (string | undefined)[];
  description: string;
  type: string;
  question: string;
  notes: string;
  isModified: boolean;
  duration: number;
}

export interface IResponseQuestion {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  categories: string[];
  category: string;
  notes?: string;
  level: string;
  description: string;
  answer: number[];
  options: string[];
  type: QuestionType;
  isModified: boolean;
  duration: number;
}
