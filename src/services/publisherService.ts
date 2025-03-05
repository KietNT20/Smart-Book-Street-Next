import { API_ENDPOINT } from '@/constant/api-url';
import { SearchPublisher } from '@/types/publisher-types';
import axiosInstance from '@/utils/axiosInstance';

export const publisherService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_ENDPOINT.PUBLISHERS.GET_ALL);
    return res.data;
  },
  search: async (payload: Partial<SearchPublisher>) => {
    const res = await axiosInstance.post(
      API_ENDPOINT.PUBLISHERS.SEARCH,
      payload
    );
    return res.data;
  }
};
