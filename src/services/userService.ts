import { API_URL } from '@/constant/api-url';
import {
  LoginCredentials,
  LoginResponse,
  RegisterRequestBody,
} from '@/types/auth-types';
import {
  UserParams,
  UserProfileResponse,
  UserResponseAll,
  UsersResponse,
} from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';
import tokenMethod from '@/utils/token';

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
    const res = await axiosInstance.get(`${API_URL.USERS.PROFILE}`, {
      headers: {
        Authorization: `Bearer ${tokenMethod.get()?.accessToken}`,
      },
    });
    return res.data;
  },
  getAll: async (): Promise<UserResponseAll> => {
    const res = await axiosInstance.get(API_URL.USERS.INDEX);
    return res.data;
  },
  getUsersParams: async (params: UserParams): Promise<UsersResponse> => {
    const res = await axiosInstance.post(
      `${API_URL.USERS.PAGINATION_SEARCH}`,
      params
    );
    return res.data;
  },
  getByEmail: async (email: string): Promise<UserProfileResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.USERS.GET_BY_EMAIL}/${email}`
    );
    return res.data;
  },
  create: async (formData: FormData) => {
    const res = await axiosInstance.post(`${API_URL.USERS.INDEX}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  update: async (id: string, formData: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.USERS.INDEX}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.USERS.INDEX}/${id}`);
    return res.data;
  },
  getById: async (id: string): Promise<UserProfileResponse> => {
    const res = await axiosInstance.get(`${API_URL.USERS.INDEX}/${id}`);
    return res.data;
  },
};
