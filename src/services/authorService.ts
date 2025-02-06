import { API_ENDPOINT } from '@/constant/api-url';
import { AuthorPayload } from '@/types/author-types';
import axiosInstance from '@/utils/axiosInstance';

export const authorService = {
  add: async (payload: AuthorPayload) => {
    const res = await axiosInstance.post(API_ENDPOINT.AUTHORS.ADD, payload);
    return res.data;
  },
};
