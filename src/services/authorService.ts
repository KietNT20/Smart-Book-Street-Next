import { API_ENDPOINT } from '@/constant/api-url';
import {
  Author,
  AuthorPayload,
  SearchPaginationAuthor,
} from '@/types/author-types';
import axiosInstance from '@/utils/axiosInstance';

export const authorService = {
  getById: async (id: string) => {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.AUTHORS.GET_BY_ID}/${id}`
    );
    return res.data;
  },
  search: async (payload: { authorName: string }) => {
    const res = await axiosInstance.post(API_ENDPOINT.AUTHORS.SEARCH, payload);
    return res.data;
  },
  searchPagination: async (payload: SearchPaginationAuthor) => {
    const res = await axiosInstance.post(
      API_ENDPOINT.AUTHORS.SEARCH_PAGINATION,
      payload
    );
    return res.data;
  },
  add: async (payload: AuthorPayload) => {
    const res = await axiosInstance.post(API_ENDPOINT.AUTHORS.ADD, payload);
    return res.data;
  },
  update: async (payload: Partial<Omit<Author, 'images'>>) => {
    const res = await axiosInstance.put(API_ENDPOINT.AUTHORS.UPDATE, payload);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.AUTHORS.DELETE}?id=${id}`
    );
    return res.data;
  },
};
