import { VALIDATE_MESSAGE } from '@/app/constants/common';
import * as Yup from 'yup';

export const createAssessmentSchema = Yup.object({
  name: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
  level: Yup.string().required(VALIDATE_MESSAGE.REQUIRE_MESSAGE),
});
