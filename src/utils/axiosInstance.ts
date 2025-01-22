import { auth } from '@/auth';
import { BASE_URL } from '@/constant/environment';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});
// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await auth();
    // Do something before request is sent
    if (session?.user?.token) {
      config.headers.Authorization = `Bearer ${session?.user?.token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error: AxiosError) => {
    console.log('error', error);
    // If the error code is 403 or 401
    // If the error is not 403 or 401, return the original error
    return Promise.reject(error);
  }
);

export default axiosInstance;
