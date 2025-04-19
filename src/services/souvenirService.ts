import { API_URL } from '@/constant/api-url';
import { SouvenirParams } from '@/types/souvenir-types';
import axiosInstance from '@/utils/axiosInstance';

export const souvenirService = {
  create: async (data: FormData) => {
    const res = await axiosInstance.post(API_URL.SOUVENIRS.INDEX, data);
    return res.data;
  },
  update: async (id: string, data: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.SOUVENIRS.INDEX}/${id}`,
      data
    );
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`${API_URL.SOUVENIRS.INDEX}/${id}`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.SOUVENIRS.INDEX}/${id}`);
    return res.data;
  },
  getAllPagination: async (params: SouvenirParams) => {
    const res = await axiosInstance.post(
      API_URL.SOUVENIRS.PAGINATION_SEARCH,
      params
    );
    return res.data;
  },
};
