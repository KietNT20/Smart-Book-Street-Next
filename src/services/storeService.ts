import { API_URL } from '@/constant/api-url';
import { StoreParams } from '@/types/store-types';
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
    const res = await axiosInstance.post(API_URL.STORES.INDEX, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
  update: async (id: string, payload: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.STORES.INDEX}/${id}`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.delete(`${API_URL.STORES.INDEX}/${id}`);
    return res.data;
  },
  searchPagination: async (params: StoreParams) => {
    const res = await axiosInstance.post(
      API_URL.STORES.PAGINATION_SEARCH,
      params
    );
    return res.data;
  }
};
