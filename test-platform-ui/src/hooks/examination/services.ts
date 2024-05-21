import { EXAMINATION_API } from '@/constants/api-endpoints';
import { HttpMethod, httpRequest } from '@/libs/apis/axios';
import { ISubmitExamPayload } from './types';

export const getExamination = async (examId: string) => {
  const result = await httpRequest({
    method: HttpMethod.Get,
    url: EXAMINATION_API.getExaminationInfo.api(examId),
  });

  return result.data;
};

export const submitExamination = async (
  examId: string,
  data: ISubmitExamPayload,
) => {
  const result = await httpRequest({
    method: HttpMethod.Put,
    url: EXAMINATION_API.submitExamination.api(examId),
    data,
  });

  return result.data;
};

export const updateExaminationExpired = async (examId: string) => {
  const result = await httpRequest({
    method: HttpMethod.Put,
    url: EXAMINATION_API.updateAssessmentExpired.api(examId),
  });

  return result.data;
};
