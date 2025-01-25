import { API_ENDPOINT } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const roleService = {
  getAll() {
    return axiosInstance.get(`${API_ENDPOINT.ROLES.GET_ALL}`);
  },
  add(payload = {}) {
    return axiosInstance.post(`${API_ENDPOINT.ROLES.ADD}`, payload);
  },
  delete(payload = {}) {
    return axiosInstance.put(`${API_ENDPOINT.ROLES.DELETE}`, payload);
  },
};
