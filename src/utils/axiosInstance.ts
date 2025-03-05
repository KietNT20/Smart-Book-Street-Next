import { BASE_URL } from '@/constant/environment';
import { PATH } from '@/enums/path';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});
// Add a request interceptor
axiosInstance.interceptors.request.use(
  async function (config: InternalAxiosRequestConfig) {
    // Do something before request is sent
    if (typeof window !== 'undefined') {
      const session = await getSession();
      if (session) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
    return config;
  },
  function (error: AxiosError) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401 || error.response?.status === 403) {
        redirect(PATH.LOGIN);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
