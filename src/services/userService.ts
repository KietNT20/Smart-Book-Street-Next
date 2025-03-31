import { API_URL } from '@/constant/api-url';
import { LoginCredentials, RegisterRequestBody } from '@/types/auth-types';
import axiosInstance from '@/utils/axiosInstance';

export const userService = {
  login: async (payload: LoginCredentials) => {
    const res = await axiosInstance.post(`${API_URL.USERS.LOGIN}`, payload);
    return res.data;
  },
  register: async (payload: RegisterRequestBody) => {
    const res = await axiosInstance.post(`${API_URL.USERS.REGISTER}`, payload);
    return res.data;
  }
};
