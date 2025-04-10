import { API_URL } from '@/constant/api-url';
import {
  LoginCredentials,
  LoginResponse,
  RegisterRequestBody,
} from '@/types/auth-types';
import { UserProfileResponse } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const userService = {
  login: async (payload: LoginCredentials): Promise<LoginResponse> => {
    const res = await axiosInstance.post(`${API_URL.USERS.LOGIN}`, payload);
    return res.data;
  },
  register: async (payload: RegisterRequestBody) => {
    const res = await axiosInstance.post(`${API_URL.USERS.REGISTER}`, payload);
    return res.data;
  },
  getProfile: async (): Promise<UserProfileResponse> => {
    const res = await axiosInstance.get(`${API_URL.USERS.PROFILE}`);
    return res.data;
  },
};
