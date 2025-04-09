import { API_URL } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const streetService = {
  getAll: async () => {
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
