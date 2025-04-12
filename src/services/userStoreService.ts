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
};
