import { VALIDATE_MESSAGE } from '@/constants/common';
import * as Yup from 'yup';

export const createQuestionSchema = Yup.object({
  description: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  // .test(
  //   'len',
  //   'Question content must be less than 100 characters',
  //   (val) => val.length > 100,
  // ),
  categories: Yup.array()
    .of(Yup.string())
    .required(VALIDATE_MESSAGE.REQUIRE_MESSAGE)
    .min(1),
  level: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  type: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
});
