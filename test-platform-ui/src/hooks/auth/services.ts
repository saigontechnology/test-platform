import { AUTH_API } from '@/constants/api-endpoints';
import { HttpMethod, httpRequest } from '@/libs/apis/axios';
import { ISignInPayload } from './types';
import Cookies from 'js-cookie';
import { COOKIE } from '@/constants/common';

export const signIn = async (data: ISignInPayload) => {
  const result = await httpRequest({
    method: HttpMethod.Post,
    url: AUTH_API.signIn.api,
    data,
  });

  Cookies.set(COOKIE.TOKEN, result.data.accessToken);

  return result.data;
};
