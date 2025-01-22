import { API_ENDPOINT } from '@/constant/api-url';
import { LoginCredentials, RegisterRequestBody } from '@/types/auth.types';
import axiosInstance from '@/utils/axiosInstance';

export const userService = {
  login(payload: LoginCredentials) {
    return axiosInstance.post(`${API_ENDPOINT.USERS.LOGIN}`, payload);
  },
  register(payload: RegisterRequestBody) {
    return axiosInstance.post(`${API_ENDPOINT.USERS.REGISTER}`, payload);
  },
  getAll() {
    return axiosInstance.get(`${API_ENDPOINT.USERS.GET_ALL}`);
  },
  getAllPagination(payload = {}) {
    return axiosInstance.post(
      `${API_ENDPOINT.USERS.GET_ALL_PAGINATION}`,
      payload
    );
  },
  getById(id: string) {
    return axiosInstance.get(`${API_ENDPOINT.USERS.GET_BY_ID}/${id}`);
  },
  getByEmail(email: string) {
    return axiosInstance.get(`${API_ENDPOINT.USERS.GET_BY_EMAIL}/${email}`);
  },
  search(payload = {}) {
    return axiosInstance.post(`${API_ENDPOINT.USERS.SEARCH}`, payload);
  },
  add(payload = {}) {
    return axiosInstance.post(`${API_ENDPOINT.USERS.ADD}`, payload);
  },
  update(payload = {}) {
    return axiosInstance.put(`${API_ENDPOINT.USERS.UPDATE}`, payload);
  },
  delete(id: string) {
    return axiosInstance.put(`${API_ENDPOINT.USERS.DELETE}/${id}`);
  },
};
