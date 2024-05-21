import { VALIDATE_MESSAGE } from '@/constants/common';
import * as Yup from 'yup';

export const createQuestionSchema = Yup.object({
  description: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  // categories: Yup.array()
  //   .of(Yup.string())
  //   .required(VALIDATE_MESSAGE.REQUIRE_MESSAGE)
  //   .min(1),
  level: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  type: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  duration: Yup.number().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
});
