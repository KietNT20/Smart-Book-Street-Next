import { API_URL } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const storeService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_URL.STORES.INDEX);
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`${API_URL.STORES.INDEX}/${id}`);
    return res.data;
  },
  create: async (payload: FormData) => {
    const res = await axiosInstance.post(API_URL.STORES.INDEX, payload);
    return res.data;
  },
  update: async (id: string, payload: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.STORES.INDEX}/${id}`,
      payload
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.delete(`${API_URL.STORES.INDEX}/${id}`);
    return res.data;
  }
};
