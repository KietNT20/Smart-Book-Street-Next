import { API_ENDPOINT } from '@/constant/api-url';
import { SearchPaginationAuthor } from '@/types/author-types';
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
      API_ENDPOINT.AUTHORS.PAGINATION_SEARCH,
      payload
    );
    return res.data;
  },
  create: async (formData: FormData) => {
    const res = await axiosInstance.post(API_ENDPOINT.AUTHORS.ADD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  update: async (id: string, formData: FormData) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.AUTHORS.UPDATE}/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.put(`${API_ENDPOINT.AUTHORS.DELETE}/${id}`);
    return res.data;
  }
};
