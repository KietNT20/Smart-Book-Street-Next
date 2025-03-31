import { BASE_URL } from '@/constant/environment';
import { PATH } from '@/enums/path';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig
} from 'axios';
import tokenMethod from './token';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL
});
// Add a request interceptor
axiosInstance.interceptors.request.use(
  async function (config: InternalAxiosRequestConfig) {
    // Do something before request is sent
    if (typeof window !== 'undefined') {
      const token = tokenMethod.get();
      if (token) {
        config.headers.Authorization = `Bearer ${token.accessToken}`;
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      tokenMethod.remove();
      window.location.href = PATH.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
