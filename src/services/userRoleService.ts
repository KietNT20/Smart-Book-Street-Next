import { API_ENDPOINT } from '@/enums/endpoint';
import axiosInstance from '@/utils/axiosInstance';

export const userRoleService = {
  addUserRole: async (payload: {
    roleId: string;
    userId: string;
    assignedAt: string;
  }) => {
    const res = await axiosInstance.post(`${API_ENDPOINT.USER_ROLE}`, payload);
    return res.data;
  },

  deleteUserRole: async (userId: string, roleId: string) => {
    const res = await axiosInstance.delete(
      `${API_ENDPOINT.USER_ROLE}/${userId}/${roleId}`
    );
    return res.data;
  },
};
