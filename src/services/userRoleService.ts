import { API_URL } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const userRoleService = {
  addUserRole: async (payload: {
    roleId: string;
    userId: string;
    assignedAt: string;
  }) => {
    const res = await axiosInstance.post(
      `${API_URL.USER_ROLES.INDEX}`,
      payload
    );
    return res.data;
  },

  deleteUserRole: async (userId: string, roleId: string) => {
    const res = await axiosInstance.patch(
      `${API_URL.USER_ROLES.INDEX}/${userId}/${roleId}`
    );
    return res.data;
  },
};
