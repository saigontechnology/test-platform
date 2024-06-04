import { VALIDATE_MESSAGE } from '@/constants/common';
import * as Yup from 'yup';

export const createQuestionSchema = Yup.object({
  description: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  // question: ,
  // type: ,
  // categories: ,
  // category: ,
  // notes: ,
  // level: ,
  // options: ,
  // answers: ,
  // duration: ,
});
