import { API_URL } from '@/constant/api-url';
import { DayOfWeek } from '@/enums/day-of-week';
import {
  StoreScheduleResponse,
  StoreSchedulesPayload,
  StoreSchedulesResponse,
  StoreSchedulesStoreID,
} from '@/types/store-types';
import axiosInstance from '@/utils/axiosInstance';

export const storeScheduleService = {
  getAll: async (): Promise<StoreSchedulesResponse> => {
    const res = await axiosInstance.get(API_URL.STORE_SCHEDULES.INDEX);
    return res.data;
  },
  getById: async (id: string): Promise<StoreScheduleResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.STORE_SCHEDULES.INDEX}/${id}`
    );
    return res.data;
  },
  create: async (payload: StoreSchedulesPayload) => {
    const res = await axiosInstance.post(
      API_URL.STORE_SCHEDULES.INDEX,
      payload
    );
    return res.data;
  },
  update: async (id: string, payload: StoreSchedulesPayload) => {
    const res = await axiosInstance.put(
      `${API_URL.STORE_SCHEDULES.INDEX}/${id}`,
      payload
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.patch(
      `${API_URL.STORE_SCHEDULES.INDEX}/${id}`
    );
    return res.data;
  },
  getAllByStoreId: async (storeId: string): Promise<StoreSchedulesStoreID> => {
    const res = await axiosInstance.get(
      `${API_URL.STORE_SCHEDULES.STORE}/${storeId}`
    );
    return res.data;
  },
  getDayOfWeekByStoreId: async (
    storeId: string,
    dayOfWeek: DayOfWeek
  ): Promise<StoreScheduleResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.STORE_SCHEDULES.STORE}/${storeId}/day/${dayOfWeek}`
    );
    return res.data;
  },
  getSpecialDateByStoreId: async (storeId: string, date: string) => {
    const res = await axiosInstance.get(
      `${API_URL.STORE_SCHEDULES.STORE}/${storeId}/special-date?specialDate=${date}`
    );
    return res.data;
  },
};
