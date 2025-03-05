import { API_ENDPOINT } from '@/constant/api-url';
import { UserRolePayload } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const userRoleService = {
  getAll: async () => {
    const res = await axiosInstance.get(`${API_ENDPOINT.USER_ROLES.GET_ALL}`);
    return res.data;
  },
  getByRole: async (roleId: string) => {
    return axiosInstance.get(
      `${API_ENDPOINT.USER_ROLES.GET_BY_ROLE_ID}/${roleId}`
    );
  },
  getByUser: async (userId: string) => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.USER_ROLES.GET_BY_USER_ID}/${userId}`
    );
    return res.data;
  },
  create: async (payload: UserRolePayload) => {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.USER_ROLES.ADD}`,
      payload
    );
    return res.data;
  },
  delete: async ({ userId, roleId }: { userId: string; roleId: string }) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.USER_ROLES.DELETE}?idUser=${userId}&idRole=${roleId}`
    );
    return res.data;
  },
};
