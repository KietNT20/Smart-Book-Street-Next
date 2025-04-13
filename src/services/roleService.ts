import { API_ENDPOINT } from '@/enums/endpoint';
import { RolePayload, RolesResponse } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const roleService = {
  getAll: async (): Promise<RolesResponse> => {
    const res = await axiosInstance.get(API_ENDPOINT.ROLE);
    return res.data;
  },
  create: async (payload: RolePayload) => {
    const res = await axiosInstance.post(API_ENDPOINT.ROLE, payload);
    return res.data;
  },
};
