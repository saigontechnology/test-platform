import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showNotification } from '../toast';

interface RetryConfig extends AxiosRequestConfig {
  retry: number;
  retryDelay: number;
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL: 'https://test-platform-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const globalConfig: RetryConfig = {
  retry: 3,
  retryDelay: 1000,
};

//  Axios Error Handling:
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;

    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    config.retry -= 1;
    const delayRetryRequest = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('retry the request', config.url);
        resolve();
      }, config.retryDelay || 1000);
    });
    return delayRetryRequest.then(() => axiosInstance(config));
  },
);

// Axios Methods:
const AxiosMethods = {
  /**
   * Makes a GET request to the specified URL and returns the response data.
   * @param url - The URL to make the GET request to.
   * @param config - Optional Axios request configuration.
   * @returns A Promise that resolves to the response data.
   * @throws An error if the request fails.
   */
  GET: async <TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    try {
      const response = await axiosInstance.get<TResponse>(url, config);
      return response.data;
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data
        ?.message;
      showNotification(
        `Error while fetching ${url}. ${message ?? ''}`,
        'error',
      );
      throw error;
    }
  },

  /**
   * Sends a POST request to the specified URL with the given data and configuration.
   * @template TRequest The type of the request data.
   * @template TResponse The type of the response data.
   * @param {string} url The URL to send the request to.
   * @param {TRequest} data The data to send with the request.
   * @param {AxiosRequestConfig} [config] The configuration for the request.
   * @returns {Promise<TResponse>} A promise that resolves with the response data.
   * @throws {AxiosError} If the request fails.
   */
  POST: async <TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    try {
      const response = await axiosInstance<TResponse>({
        url,
        method: 'post',
        ...config,
      });
      return response.data;
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data
        ?.message;
      showNotification(`Error while posting ${url}. ${message ?? ''}`, 'error');
      throw error;
    }
  },

  /**
   * Sends a PUT request to the specified URL with the provided data and configuration.
   * @template TRequest The type of the request data.
   * @template TResponse The type of the response data.
   * @param {string} url The URL to send the request to.
   * @param {TRequest} data The data to send with the request.
   * @param {AxiosRequestConfig} [config] The configuration for the request.
   * @returns {Promise<TResponse>} A promise that resolves with the response data.
   * @throws {AxiosError} If the request fails.
   */
  PUT: async <TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    try {
      const response = await axiosInstance<TResponse>({
        url,
        method: 'put',
        ...config,
      });
      return response.data;
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data
        ?.message;
      showNotification(
        `Error while updating ${url}. ${message ?? ''}`,
        'error',
      );
      throw error;
    }
  },

  // PATCH

  /**
   * Sends a DELETE request to the specified URL using axiosInstance.
   * @template TResponse The expected response type.
   * @param {string} url The URL to send the request to.
   * @param {AxiosRequestConfig} [config] The optional request configuration.
   * @returns {Promise<TResponse>} A promise that resolves with the response data.
   * @throws {AxiosError} If the request fails.
   */
  DELETE: async <TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> => {
    try {
      const response = await axiosInstance.delete<TResponse>(url, config);
      return response.data;
    } catch (error) {
      const message = (error as AxiosError<{ message: string }>).response?.data
        ?.message;
      showNotification(
        `Error while deleting ${url}. ${message ?? ''}`,
        'error',
      );
      throw error;
    }
  },
};

const ApiHook = async <T>(
  method: Methods,
  url: string,
  configs?: AxiosRequestConfig,
) => {
  let data: T = null as T,
    error = null;

  try {
    const _axios = AxiosMethods[method];
    const response: AxiosResponse<T> = await _axios(url, configs);
    data = response as T;
  } catch (_error) {
    // ✅ TypeScript knows err is Error
    error =
      _error instanceof AxiosError
        ? { errorCode: _error.code, message: _error.message }
        : _error;
  }
  return { data, error };
};

export default ApiHook;
