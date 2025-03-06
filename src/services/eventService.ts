import { API_ENDPOINT } from '@/constant/api-url';
import { Event } from '@/types/event-types';
import axiosInstance from '@/utils/axiosInstance';

export const eventService = {
  create: async (payload: Partial<Omit<Event, 'id'>>) => {
    const res = await axiosInstance.post(API_ENDPOINT.EVENTS.ADD, payload);
    return res.data;
  },
  update: async (payload: Partial<Event>) => {
    const res = await axiosInstance.put(API_ENDPOINT.EVENTS.UPDATE, payload);
    return res.data;
  }
};
