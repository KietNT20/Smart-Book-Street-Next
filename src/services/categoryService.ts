import { API_URL } from '@/constant/api-url';
import { CategorySearchPagination } from '@/types/category-types';
import axiosInstance from '@/utils/axiosInstance';

export interface CategoryPayload {
  categoryName: string;
  description: string;
}

export const categoryService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_URL.CATEGORIES.INDEX);
    return res.data;
  },
  create: async (payload: Partial<CategoryPayload>) => {
    const res = await axiosInstance.post(API_URL.CATEGORIES.INDEX, payload);
    return res.data;
  },
  update: async (id: string, payload: Partial<CategoryPayload>) => {
    const res = await axiosInstance.put(
      `${API_URL.CATEGORIES.INDEX}/${id}`,
      payload
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.CATEGORIES.INDEX}/${id}`);
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`${API_URL.CATEGORIES.INDEX}/${id}`);
    return res.data;
  },
  search: async (payload: { categoryName: string }) => {
    const res = await axiosInstance.post(API_URL.CATEGORIES.SEARCH, payload);
    return res.data;
  },
  searchPagination: async (payload: Partial<CategorySearchPagination>) => {
    const res = await axiosInstance.post(
      API_URL.CATEGORIES.PAGINATION_SEARCH,
      payload
    );
    return res.data;
  }
};
