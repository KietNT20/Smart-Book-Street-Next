import { API_ENDPOINT } from '@/constant/api-url';
import { RolePayload } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const roleService = {
  getAll: async () => {
    const res = await axiosInstance.get(`${API_ENDPOINT.ROLES.GET_ALL}`);
    return res.data;
  },
  add: async (payload: RolePayload) => {
    const res = await axiosInstance.post(`${API_ENDPOINT.ROLES.ADD}`, payload);
    return res.data;
  },
  delete: async (payload = {}) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.ROLES.DELETE}`,
      payload
    );
    return res.data;
  },
};
