import { VALIDATE_MESSAGE } from '@/constants/common';
import * as Yup from 'yup';

export const createQuestionSchema = Yup.object({
  // type: Yup.string().required(REQUIRE_MESSAGE),
  question: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  // content: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  // .test(
  //   'len',
  //   'Question content must be less than 200 characters',
  //   (val) => val.length > 200,
  // ),
});
