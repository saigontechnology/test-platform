import { QUESTION_API } from '@/constants/api-endpoints';
import { HttpMethod, httpRequest } from '@/libs/apis/axios';

export const getQuestions = async (data: any) => {
  const result = await httpRequest({
    method: HttpMethod.Get,
    url: QUESTION_API.getQuestions.api(),
    data,
  });
  return result.data;
};

export const getFilters = async () => {
  const result = await httpRequest({
    method: HttpMethod.Get,
    url: QUESTION_API.getFilters.api(),
  });
  return result.data;
};
