import { API_URL } from '@/constant/api-url';
import {
  BookAuthorPaginated,
  BookAuthorSearchPagination,
} from '@/types/author-types';
import axiosInstance from '@/utils/axiosInstance';

export const bookAuthorService = {
  create: async (payload: { bookId: string; authorId: string }) => {
    const res = await axiosInstance.post(API_URL.BOOK_AUTHORS.INDEX, payload);
    return res.data;
  },
  delete: async (bookId: string, authorId: string) => {
    const res = await axiosInstance.patch(
      `${API_URL.BOOK_AUTHORS.INDEX}/${bookId}/${authorId}`
    );
    return res.data;
  },
  searchPagination: async (payload: BookAuthorSearchPagination) => {
    const res = await axiosInstance.post(
      API_URL.BOOK_AUTHORS.PAGINATION_SEARCH,
      payload
    );
    return res.data;
  },
  filter: async (payload: Partial<BookAuthorPaginated>) => {
    const res = await axiosInstance.post(API_URL.BOOK_AUTHORS.FILTER, payload);
    return res.data;
  },
};
