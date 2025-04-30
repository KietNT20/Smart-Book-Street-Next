import { API_URL } from '@/constant/api-url';
import {
  AuthorResponse,
  AuthorSearchPagination,
  AuthorSearchResponse,
  AuthorsResponse,
} from '@/types/author-types';
import axiosInstance from '@/utils/axiosInstance';

export const authorService = {
  create: async (formData: FormData) => {
    const res = await axiosInstance.post(API_URL.AUTHORS.INDEX, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  update: async (id: string, formData: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.AUTHORS.INDEX}/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.AUTHORS.INDEX}/${id}`);
    return res.data;
  },
  getById: async (id: string): Promise<AuthorResponse> => {
    const res = await axiosInstance.get(`${API_URL.AUTHORS.INDEX}/${id}`);
    return res.data;
  },
  search: async (payload: {
    authorName: string;
    categoryId?: string;
  }): Promise<AuthorSearchResponse> => {
    const res = await axiosInstance.post(API_URL.AUTHORS.SEARCH, payload);
    return res.data;
  },
  searchPagination: async (
    payload: AuthorSearchPagination
  ): Promise<AuthorsResponse> => {
    const res = await axiosInstance.post(
      API_URL.AUTHORS.PAGINATION_SEARCH,
      payload
    );
    return res.data;
  },
};
