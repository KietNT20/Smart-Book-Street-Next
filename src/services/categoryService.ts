import { API_ENDPOINT } from '@/constant/api-url';
import { Category, SearchPaginationCategory } from '@/types/category-types';
import axiosInstance from '@/utils/axiosInstance';

export const categoryService = {
  search: async (payload: { categoryName: string }) => {
    const res = await axiosInstance.post(
      API_ENDPOINT.CATEGORIES.SEARCH,
      payload
    );
    return res.data;
  },
  searchPagination: async (payload: SearchPaginationCategory) => {
    const res = await axiosInstance.post(
      API_ENDPOINT.CATEGORIES.PAGINATION_SEARCH,
      payload
    );
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.CATEGORIES.GET_BY_ID}/${id}`
    );
    return res.data;
  },
  create: async (payload: Partial<Omit<Category, 'id'>>) => {
    const res = await axiosInstance.post(API_ENDPOINT.CATEGORIES.ADD, payload);
    return res.data;
  },
  update: async (payload: Partial<Category>) => {
    const res = await axiosInstance.put(
      API_ENDPOINT.CATEGORIES.UPDATE,
      payload
    );
    return res.data;
  },
};
