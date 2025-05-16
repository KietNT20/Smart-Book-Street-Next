import { API_URL } from '@/constant/api-url';
import {
  StreetParams,
  StreetResponse,
  StreetsResponse,
} from '@/types/street-types';
import axiosInstance from '@/utils/axiosInstance';

export const streetService = {
  getAll: async (): Promise<StreetsResponse> => {
    const res = await axiosInstance.get(`${API_URL.STREETS.INDEX}/non-deleted`);
    return res.data;
  },
  getById: async (id: string): Promise<StreetResponse> => {
    const res = await axiosInstance.get(`${API_URL.STREETS.INDEX}/${id}`);
    return res.data;
  },
  getPagination: async (params: StreetParams): Promise<StreetsResponse> => {
    const res = await axiosInstance.post(
      `${API_URL.STREETS.PAGINATION_SEARCH}`,
      params
    );
    return res.data;
  },
  create: async (data: FormData) => {
    const res = await axiosInstance.post(API_URL.STREETS.INDEX, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  update: async (id: string, data: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.STREETS.INDEX}/${id}`,
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
    const res = await axiosInstance.patch(`${API_URL.STREETS.INDEX}/${id}`);
    return res.data;
  },
};
