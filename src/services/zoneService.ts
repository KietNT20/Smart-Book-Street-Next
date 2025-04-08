import { API_URL } from '@/constant/api-url';
import { ZoneParams } from '@/types/zone-types';
import axiosInstance from '@/utils/axiosInstance';

export const zoneService = {
  getNonDeleted: async () => {
    const res = await axiosInstance.get(`${API_URL.ZONES.INDEX}/non-deleted`);
    return res.data;
  },
  getAll: async (params: ZoneParams) => {
    const res = await axiosInstance.post(API_URL.ZONES.INDEX, params);
    return res.data;
  },
  create: async (data: FormData) => {
    const res = await axiosInstance.post(API_URL.ZONES.INDEX, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  }
};
