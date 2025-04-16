import { API_URL } from '@/constant/api-url';
import { ApiListResponse } from '@/types/common-types';
import { Street } from '@/types/street-types';
import axiosInstance from '@/utils/axiosInstance';

export const streetService = {
  getAll: async (): Promise<ApiListResponse<Street>> => {
    const res = await axiosInstance.get(`${API_URL.STREETS.INDEX}/non-deleted`);
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
};
