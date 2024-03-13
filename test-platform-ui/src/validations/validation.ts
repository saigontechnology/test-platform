import { VALIDATE_MESSAGE } from '@/constants/common';
import * as Yup from 'yup';

export const Validations = Yup.object({
  email: Yup.string()
    .email()
    .required(VALIDATE_MESSAGE.WRONG_EMAIL_PATTERN)
    .matches(
      /\@saigontechnology.com$/,
      'Email have to match with domain @saigontechnology.com',
    ),
});
