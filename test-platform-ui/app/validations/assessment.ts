import { REQUIRE_MESSAGE } from '@/app/constants/common';
import * as Yup from 'yup';

export const createAssessmentSchema = Yup.object({
  name: Yup.string().required(REQUIRE_MESSAGE),
  level: Yup.string().required(REQUIRE_MESSAGE),
});
