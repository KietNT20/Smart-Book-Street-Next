import { API_URL } from '@/constant/api-url';
import { UserStorePayload } from '@/types/user-types';
import axiosInstance from '@/utils/axiosInstance';

export const userStoreService = {
  registerUserStore: async (payload: UserStorePayload) => {
    const res = await axiosInstance.post(
      `${API_URL.USER_STORES.INDEX}`,
      payload
    );
    return res.data;
  },
  checkUserContract: async (userId: string) => {
    const res = await axiosInstance.get(
      `${API_URL.USER_STORES.USER}/${userId}`
    );
    return res.data;
  },
  checkStoreContract: async (storeId: string) => {
    const res = await axiosInstance.get(
      `${API_URL.USER_STORES.STORE}/${storeId}`
    );
    return res.data;
  },
};
