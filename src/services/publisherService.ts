import { API_URL } from '@/constant/api-url';
import {
  PublisherParams,
  PublisherSearch,
  PublishersResponse,
} from '@/types/publisher-types';
import axiosInstance from '@/utils/axiosInstance';

export const publisherService = {
  getAll: async (): Promise<PublishersResponse> => {
    const res = await axiosInstance.get(API_URL.PUBLISHERS.INDEX);
    return res.data;
  },
  getAllParams: async (
    params: PublisherParams
  ): Promise<PublishersResponse> => {
    const res = await axiosInstance.post(
      API_URL.PUBLISHERS.PAGINATION_SEARCH,
      params
    );
    return res.data;
  },
  search: async (
    payload: Partial<PublisherSearch>
  ): Promise<PublishersResponse> => {
    const res = await axiosInstance.post(API_URL.PUBLISHERS.SEARCH, payload);
    return res.data;
  },
  create: async (data: FormData) => {
    const res = await axiosInstance.post(API_URL.PUBLISHERS.INDEX, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  update: async (id: string, data: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.PUBLISHERS.INDEX}/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.PUBLISHERS.INDEX}/${id}`);
    return res.data;
  },
};
