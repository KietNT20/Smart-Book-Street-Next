import { API_URL } from '@/constant/api-url';
import {
  BookPaginated,
  BookResponse,
  BookSearchPagination,
  BooksResponse,
} from '@/types/book-types';
import axiosInstance from '@/utils/axiosInstance';

export const bookService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_URL.BOOKS.INDEX);
    return res.data;
  },
  create: async (formData: FormData) => {
    const res = await axiosInstance.post(API_URL.BOOKS.INDEX, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  update: async (id: string, formData: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.BOOKS.INDEX}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.BOOKS.INDEX}/${id}`);
    return res.data;
  },
  getByID: async (id: string): Promise<BookResponse> => {
    const res = await axiosInstance.get(`${API_URL.BOOKS.INDEX}/${id}`);
    return res.data;
  },
  paginated: async (payload: BookPaginated): Promise<BooksResponse> => {
    const res = await axiosInstance.post(API_URL.BOOKS.PAGINATED, payload);
    return res.data;
  },
  searchPagination: async (
    payload: BookSearchPagination
  ): Promise<BooksResponse> => {
    const res = await axiosInstance.post(
      API_URL.BOOKS.PAGINATION_SEARCH,
      payload
    );
    return res.data;
  },
  getGoogleIsbn: async (isbn: string) => {
    const res = await axiosInstance.get(
      `${API_URL.BOOKS.INDEX}/google/${isbn}`
    );
    return res.data;
  },
};
