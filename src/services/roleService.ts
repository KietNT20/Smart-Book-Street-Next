import { API_ENDPOINT } from '@/enums/endpoint';
import { RolesResponse } from '@/types/auth-types';
import { RolePayload } from '@/types/user-types';
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
  getAvailableForRequest: async (): Promise<RolesResponse> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.ROLE}/available-for-request`
    );
    return res.data;
  },
};
