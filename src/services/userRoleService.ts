import { API_ENDPOINT } from '@/enums/endpoint';
import { UserRoleAllResponse } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const userRoleService = {
  getAll: async (): Promise<UserRoleAllResponse> => {
    const res = await axiosInstance.get(`${API_ENDPOINT.USER_ROLE}`);
    return res.data;
  },
  getByUserId: async (userId: string): Promise<UserRoleAllResponse> => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.USER_ROLE}/user/${userId}`
    );
    return res.data;
  },
  addUserRole: async (payload: {
    roleId: string;
    userId: string;
    assignedAt: string;
  }) => {
    const res = await axiosInstance.post(`${API_ENDPOINT.USER_ROLE}`, payload);
    return res.data;
  },
  approveUserRole: async (
    userId: string,
    roleId: string,
    approved: boolean
  ) => {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.USER_ROLE}/approve/${userId}/${roleId}?approve=${approved}`
    );
    return res.data;
  },
  deleteUserRole: async (userId: string, roleId: string) => {
    const res = await axiosInstance.patch(
      `${API_ENDPOINT.USER_ROLE}/${userId}/${roleId}`
    );
    return res.data;
  },
  pendingRoles: async (): Promise<UserRoleAllResponse> => {
    const res = await axiosInstance.get(`${API_ENDPOINT.USER_ROLE}/pending`);
    return res.data;
  },
};
