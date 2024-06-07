import { VALIDATE_MESSAGE } from '@/constants/common';
import { QuestionLevels, QuestionType } from '@/libs/definitions';
import * as Yup from 'yup';

export const createQuestionSchema = Yup.object({
  description: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  question: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  type: Yup.mixed<QuestionType>()
    .oneOf(Object.values(QuestionType))
    .required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  notes: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  level: Yup.mixed<QuestionLevels>()
    .oneOf(Object.values(QuestionLevels))
    .required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  options: Yup.array()
    .of(Yup.string())
    .min(2, 'Must have at least 2 options')
    .max(5, 'Cannot have more than 5 options'),
  answers: Yup.array()
    .of(
      Yup.number()
        .required('Array must have at least one answer')
        .typeError('All elements must be numbers'),
    )
    .min(1, 'Array must have at least one selected answer'),
  duration: Yup.number().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
});
