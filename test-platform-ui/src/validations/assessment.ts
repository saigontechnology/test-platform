import { VALIDATE_MESSAGE } from '@/constants/common';
import * as Yup from 'yup';

export const EMAIL_REGEX = /@[^.]*\./;

export const createAssessmentSchema = Yup.object({
  name: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  level: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  questions: Yup.array().of(
    Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  ),
});

export const sendAssessmentInvitationSchema = Yup.object({
  email: Yup.string()
    .required(VALIDATE_MESSAGE.REQUIRE_MESSAGE)
    .email(VALIDATE_MESSAGE.WRONG_EMAIL_PATTERN)
    .matches(EMAIL_REGEX, VALIDATE_MESSAGE.WRONG_EMAIL_PATTERN),
});
