import { API_URL } from '@/constant/api-url';
import { PublisherSearch } from '@/types/publisher-types';
import axiosInstance from '@/utils/axiosInstance';

export const publisherService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_URL.PUBLISHERS.INDEX);
    return res.data;
  },
  search: async (payload: Partial<PublisherSearch>) => {
    const res = await axiosInstance.post(API_URL.PUBLISHERS.SEARCH, payload);
    return res.data;
  },
};
