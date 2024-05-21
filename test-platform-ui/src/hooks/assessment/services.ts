import { ASSESSMENT_API } from '@/constants/api-endpoints';
import { HttpMethod, httpRequest } from '@/libs/apis/axios';

export const getAssessmentById = async (assessmentId: string) => {
  const result = await httpRequest({
    method: HttpMethod.Get,
    url: ASSESSMENT_API.getAssessmentById.api(assessmentId),
  });

  return result.data;
};
