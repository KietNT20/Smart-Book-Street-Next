import { API_URL } from '@/constant/api-url';
import {
  ZoneCreate,
  ZoneParams,
  ZoneResponse,
  ZonesResponse,
} from '@/types/zone-types';
import axiosInstance from '@/utils/axiosInstance';

export const zoneService = {
  getNonDeleted: async (): Promise<ZonesResponse> => {
    const res = await axiosInstance.get(`${API_URL.ZONES.INDEX}/non-deleted`);
    return res.data;
  },
  getAll: async (params: ZoneParams): Promise<ZonesResponse> => {
    const res = await axiosInstance.post(API_URL.ZONES.INDEX, params);
    return res.data;
  },
  getById: async (id: string): Promise<ZoneResponse> => {
    const res = await axiosInstance.get(`${API_URL.ZONES.INDEX}/${id}`);
    return res.data;
  },
  create: async (payload: ZoneCreate) => {
    const res = await axiosInstance.post(API_URL.ZONES.INDEX, payload);
    return res.data;
  },
  update: async (id: string, payload: ZoneCreate) => {
    const res = await axiosInstance.put(
      `${API_URL.ZONES.INDEX}/${id}`,
      payload
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.ZONES.INDEX}/${id}`);
    return res.data;
  },
};
