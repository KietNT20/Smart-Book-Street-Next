import { API_ENDPOINT } from '@/constant/api-url';
import { BookFormValues } from '@/lib/zod';
import { BookSearchPayload } from '@/types/book-types';
import axiosInstance from '@/utils/axiosInstance';

export const bookService = {
  getByID: async (id: string) => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.BOOKS.GET_BY_ID}/${id}`
    );
    return res.data;
  },

  searchPagination: async (payload: BookSearchPayload) => {
    const res = await axiosInstance.post(
      API_ENDPOINT.BOOKS.PAGINATION_SEARCH,
      payload
    );
    return res.data;
  },

  create: async (payload: BookFormValues) => {
    const res = await axiosInstance.post(API_ENDPOINT.BOOKS.ADD, payload);
    return res.data;
  },

  update: async (payload: BookFormValues) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.BOOKS.UPDATE}`,
      payload
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.BOOKS.DELETE}?id=${id}`
    );
    return res.data;
  },
};
