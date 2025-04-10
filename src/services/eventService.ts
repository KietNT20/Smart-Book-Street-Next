import { API_URL } from '@/constant/api-url';
import { Event } from '@/types/event-types';
import axiosInstance from '@/utils/axiosInstance';

export const eventService = {
  create: async (payload: Partial<Omit<Event, 'id'>>) => {
    const res = await axiosInstance.post(API_URL.EVENTS.INDEX, payload);
    return res.data;
  },
  update: async (id: string, payload: Partial<Omit<Event, 'id'>>) => {
    const res = await axiosInstance.put(
      `${API_URL.EVENTS.INDEX}/${id}`,
      payload
    );
    return res.data;
  },
};
