import { BASE_URL } from '@/constant/environment';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import tokenMethod from './token';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${tokenMethod.get()?.accessToken}`;
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
    return response.data as Promise<AxiosResponse>;
  },
  async (error: AxiosError) => {
    console.log('error', error);
    const originalRequest = error.config;

    // If the error code is 403 or 401 and the request does not contain the _retry key
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest?.url?.includes('/user/refresh')
    ) {
      try {
        // Call the refresh token API
        const res = await axiosInstance.put('/user/refresh', {
          refreshToken: tokenMethod.get()?.refreshToken,
        });
        const { token: accessToken, refreshToken } = res.data?.data || {};

        // Save the new token to local storage or cookie
        tokenMethod.set({
          accessToken,
          refreshToken,
        });

        // Change the token in the header of the initial request
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          // Recall the original request with the new token
          return axiosInstance(originalRequest);
        }
      } catch (error) {
        console.log(error);
        // Handle error if request is not successful
        tokenMethod.remove();
      }
    }

    // If the error is not 403 or 401, return the original error
    return Promise.reject(error);
  }
);

export default axiosInstance;
