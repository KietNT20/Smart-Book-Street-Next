import { API_ENDPOINT } from '@/constant/api-url';
import { BookFormValues } from '@/lib/zod';
import { BookSearchPayload } from '@/types/book-types';
import axiosInstance from '@/utils/axiosInstance';

export const bookService = {
  search: async (payload: BookSearchPayload) => {
    const res = await axiosInstance.post(API_ENDPOINT.BOOKS.SEARCH, payload);
    return res.data;
  },

  create: async (data: BookFormValues) => {
    const res = await axiosInstance.post(API_ENDPOINT.BOOKS.ADD, data);
    return res.data;
  },

  update: async (data: BookFormValues) => {
    const res = await axiosInstance.put(`${API_ENDPOINT.BOOKS.UPDATE}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.BOOKS.DELETE}?id=${id}`
    );
    return res.data;
  },
};
