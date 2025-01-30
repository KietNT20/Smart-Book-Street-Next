import { API_ENDPOINT } from '@/constant/api-url';
import { LoginCredentials, RegisterRequestBody } from '@/types/auth.types';
import { PaginationSchema } from '@/types/common-types';
import axiosInstance from '@/utils/axiosInstance';

export const userService = {
  login: async (payload: LoginCredentials) => {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.USERS.LOGIN}`,
      payload
    );
    return res.data;
  },
  register: async (payload: RegisterRequestBody) => {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.USERS.REGISTER}`,
      payload
    );
    return res.data;
  },
  getAll: async () => {
    const res = await axiosInstance.get(`${API_ENDPOINT.USERS.GET_ALL}`);
    return res.data;
  },
  getAllPagination: async (payload: PaginationSchema) => {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.USERS.GET_ALL_PAGINATION}`,
      payload
    );
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.USERS.GET_BY_ID}/${id}`
    );
    return res.data;
  },
  getByEmail: async (email: string) => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.USERS.GET_BY_EMAIL}/${email}`
    );
    return res.data;
  },
  search: async (payload = {}) => {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.USERS.SEARCH}`,
      payload
    );
    return res.data;
  },
  add: async (payload = {}) => {
    const res = await axiosInstance.post(`${API_ENDPOINT.USERS.ADD}`, payload);
    return res.data;
  },
  update: async (payload = {}) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.USERS.UPDATE}`,
      payload
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.put(`${API_ENDPOINT.USERS.DELETE}/${id}`);
    return res.data;
  },
};
