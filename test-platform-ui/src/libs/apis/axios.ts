import { COOKIE } from '@/constants/common';
import { ERROR_CODE } from '@/constants/error-code';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// import { ROUTES_PATH } from '@/constants/routes-path';

export enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
}

export function httpRequest(
  config: AxiosRequestConfig,
  options?: { suppressErrorToasts: boolean },
) {
  const timezoneOffset = -new Date().getTimezoneOffset();
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-timezone': timezoneOffset,
    },
  });

  if (!options?.suppressErrorToasts) {
    const setAuthorizationHeader = (request: AxiosRequestConfig | any, token: string) => {
      request.headers.Authorization = `Bearer ${token}`;
    };

    const onRequest = (config: AxiosRequestConfig | any) => {
      const token = Cookies.get(COOKIE.TOKEN);
      token && setAuthorizationHeader(config, token);
      return config;
    };

    const onRequestError = (error: AxiosError) => {
      return Promise.reject(error);
    };

    const onResponse = (response: AxiosResponse) => {
      return response;
    };

    const onResponseError = (error: AxiosError | any) => {
      if (error.isAxiosError) {
        if (error.code === ERROR_CODE.ERR_NETWORK) {
          // showToast(error.message, 'error');
        }

        switch (error.response?.status) {
          case ERROR_CODE.BAD_REQUEST:
            // showToast(error?.message, 'error');
            break;

          case ERROR_CODE.UNAUTHORIZED:
            // window.location.href = ROUTES_PATH.LOGOUT;
            break;

          case ERROR_CODE.UNPROCESSABLE_ENTITY:
            // window.location.href = ROUTES_PATH.FORBIDDEN;
            break;

          case ERROR_CODE.INTERNAL_SERVER_ERROR:
            // showToast(error?.message, 'error');
            break;

          default:
            return Promise.reject(error.response);
        }
      }

      return Promise.reject(error.response);
    };

    instance.interceptors.request.use(onRequest, onRequestError);
    instance.interceptors.response.use(onResponse, onResponseError);
  }

  return instance(config);
}
