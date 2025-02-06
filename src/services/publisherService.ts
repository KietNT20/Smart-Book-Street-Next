import { API_ENDPOINT } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const publisherService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_ENDPOINT.PUBLISHERS.GET_ALL);
    return res.data;
  },
};
