import { API_URL } from '@/constant/api-url';
import {
  StoreParams,
  StoreResponse,
  StoreSearchCriteria,
  StoresResponse,
  StoreStatisticTotal,
} from '@/types/store-types';
import axiosInstance from '@/utils/axiosInstance';

export const storeService = {
  getAll: async (): Promise<StoresResponse> => {
    const res = await axiosInstance.get(API_URL.STORES.INDEX);
    return res.data;
  },
  getById: async (id: string): Promise<StoreResponse> => {
    const res = await axiosInstance.get(`${API_URL.STORES.INDEX}/${id}`);
    return res.data;
  },
  create: async (payload: FormData) => {
    const res = await axiosInstance.post(API_URL.STORES.INDEX, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  update: async (id: string, payload: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.STORES.INDEX}/${id}`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.STORES.INDEX}/${id}`);
    return res.data;
  },
  searchPagination: async (params: StoreParams): Promise<StoresResponse> => {
    const res = await axiosInstance.post(
      API_URL.STORES.PAGINATION_SEARCH,
      params
    );
    return res.data;
  },
  search: async (payload: StoreSearchCriteria): Promise<StoresResponse> => {
    const res = await axiosInstance.post(API_URL.STORES.SEARCH, payload);
    return res.data;
  },
  getStaticsTotal: async (): Promise<StoreStatisticTotal> => {
    const res = await axiosInstance.get(`${API_URL.STORES.INDEX}/stats/total`);
    return res.data;
  },
  getStatisticProducts: async (
    storeId: string
  ): Promise<{
    bookCount: number;
    souvenirCount: number;
    totalCount: number;
  }> => {
    const res = await axiosInstance.get(
      `${API_URL.STORES.INDEX}/${storeId}/stats/products`
    );
    return res.data;
  },
};
