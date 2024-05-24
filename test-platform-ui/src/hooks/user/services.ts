import { USER_API } from '@/constants/api-endpoints';
import { HttpMethod, httpRequest } from '@/libs/apis/axios';

export const getCandidates = async () => {
  const result = await httpRequest({
    method: HttpMethod.Get,
    url: USER_API.getCandidates.api,
  });

  return result.data;
};
