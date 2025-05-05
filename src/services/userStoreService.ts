import { API_URL } from '@/constant/api-url';
import {
  UserStorePayload,
  UserStoreResponse,
  UserStoreResponseAll,
} from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const userStoreService = {
  registerUserStore: async (
    payload: UserStorePayload
  ): Promise<{ isSuccess: boolean; message: string }> => {
    const res = await axiosInstance.post(
      `${API_URL.USER_STORES.INDEX}`,
      payload
    );
    return res.data;
  },
  checkUserContract: async (userId: string): Promise<UserStoreResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.USER_STORES.USER}/${userId}`
    );
    return res.data;
  },
  checkStoreContract: async (storeId: string): Promise<UserStoreResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.USER_STORES.STORE}/${storeId}`
    );
    return res.data;
  },
  deleteUserStore: async (userId: string, storeId: string) => {
    const res = await axiosInstance.patch(
      `${API_URL.USER_STORES.INDEX}/${userId}/${storeId}`
    );
    return res.data;
  },
  getUserStores: async (): Promise<UserStoreResponseAll> => {
    const res = await axiosInstance.get(`${API_URL.USER_STORES.INDEX}`);
    return res.data;
  },
};
