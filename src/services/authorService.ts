import { API_ENDPOINT } from '@/constant/api-url';
import { AuthorPayload } from '@/types/author-types';
import axiosInstance from '@/utils/axiosInstance';

export const authorService = {
  getAllActive: async () => {
    const res = await axiosInstance.get(API_ENDPOINT.AUTHORS.GET_ALL_ACTIVE);
    return res.data;
  },
  add: async (payload: AuthorPayload) => {
    const res = await axiosInstance.post(API_ENDPOINT.AUTHORS.ADD, payload);
    return res.data;
  },
  update: async (id: string, payload: AuthorPayload) => {
    const res = await axiosInstance.put(
      `${API_ENDPOINT.AUTHORS.UPDATE}/${id}`,
      payload
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.put(`${API_ENDPOINT.AUTHORS.DELETE}/${id}`);
    return res.data;
  },
};
