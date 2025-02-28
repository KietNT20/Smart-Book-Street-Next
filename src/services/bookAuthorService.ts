import { API_ENDPOINT } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const bookAuthorService = {
  create: async (bookId: string, authorId: string) => {
    const res = await axiosInstance.post(
      `${API_ENDPOINT.BOOK_AUTHORS.ADD}?BookId=${bookId}&AuthorId=${authorId}`
    );
    return res.data;
  },
  update: async (id: string, bookId: string, authorId: string) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.BOOK_AUTHORS.UPDATE}/${id}?BookId=${bookId}&AuthorId=${authorId}`
    );
    return res.data;
  },
};
