import { API_ENDPOINT } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const categoryService = {
  search: async (payload: { categoryName: string }) => {
    const res = await axiosInstance.post(
      API_ENDPOINT.CATEGORIES.SEARCH,
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
};
