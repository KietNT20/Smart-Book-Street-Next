import { API_ENDPOINT } from '@/constant/api-url';
import { Street } from '@/types/street-types';
import axiosInstance from '@/utils/axiosInstance';

export const streetService = {
  create: async (payload: Partial<Omit<Street, 'id'>>) => {
    const res = await axiosInstance.post(API_ENDPOINT.STREETS.ADD, payload);
    return res.data;
  },
};
