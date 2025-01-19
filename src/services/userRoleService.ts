import { API_ENDPOINT } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const userRoleService = {
  getAll() {
    return axiosInstance.get(`${API_ENDPOINT.USER_ROLES.GET_ALL}`);
  },
  getByRoleId(roleId: string) {
    return axiosInstance.get(
      `${API_ENDPOINT.USER_ROLES.GET_BY_ROLE_ID}/${roleId}`
    );
  },
  getByUserId(userId: string) {
    return axiosInstance.get(
      `${API_ENDPOINT.USER_ROLES.GET_BY_USER_ID}/${userId}`
    );
  },
  add(payload = {}) {
    return axiosInstance.post(`${API_ENDPOINT.USER_ROLES.ADD}`, payload);
  },
  delete(payload = {}) {
    return axiosInstance.put(`${API_ENDPOINT.USER_ROLES.DELETE}`, payload);
  },
};
