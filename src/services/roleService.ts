import { API_URL } from '@/constant/api-url';
import { RolePayload } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const roleService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_URL.ROLES.INDEX);
    return res.data;
  },
  create: async (payload: RolePayload) => {
    const res = await axiosInstance.post(API_URL.ROLES.INDEX, payload);
    return res.data;
  }
};
