import { REQUIRE_MESSAGE } from '@/app/constants/common';
import * as Yup from 'yup';

export const createQuestionSchema = Yup.object({
  // type: Yup.string().required(REQUIRE_MESSAGE),
  title: Yup.string().required(REQUIRE_MESSAGE),
  content: Yup.string()
    .required(REQUIRE_MESSAGE)
    .test(
      'len',
      'Question content must be less than 200 characters',
      (val) => val.length > 200,
    ),
});
