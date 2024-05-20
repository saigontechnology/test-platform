// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  CODING = 'CODING',
  LOGIC = 'LOGIC',
}

export const QuestionTypes = [
  {
    label: 'Single choice',
    value: QuestionType.SINGLE_CHOICE,
  },
  {
    label: 'Multiple choice',
    value: QuestionType.MULTIPLE_CHOICE,
  },
  // {
  //   label: 'Logic',
  //   value: QuestionType.LOGIC,
  // },
  // {
  //   label: 'Coding',
  //   value: QuestionType.CODING,
  // },
];

export enum QuestionLevels {
  JUNIOR = 'JUNIOR',
  INTERMEDIATE = 'INTERMEDIATE',
  SENIOR = 'SENIOR',
  PRINCIPAL = 'PRINCIPAL',
}

export const QuestionLevel = [
  {
    label: 'Junior',
    value: QuestionLevels.JUNIOR,
  },
  {
    label: 'Intermediate',
    value: QuestionLevels.INTERMEDIATE,
  },
  {
    label: 'Senior',
    value: QuestionLevels.SENIOR,
  },
  {
    label: 'Principal',
    value: QuestionLevels.PRINCIPAL,
  },
];
