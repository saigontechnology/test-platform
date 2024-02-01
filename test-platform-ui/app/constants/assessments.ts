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

export interface IAssessment {
  id: number;
  createdAt: Date;
  name: string;
  level: string;
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
