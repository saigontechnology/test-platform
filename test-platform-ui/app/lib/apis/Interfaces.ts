export interface IResponseQuestion {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  question: string;
  category: string[];
  description: string;
  answer: number[];
  options: string[];
  type: string;
}
