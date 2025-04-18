import { API_URL } from '@/constant/api-url';
import { EventsInMonth } from '@/types/event-types';
import axiosInstance from '@/utils/axiosInstance';

export const eventService = {
  create: async (formData: FormData) => {
    const res = await axiosInstance.post(API_URL.EVENTS.INDEX, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  update: async (id: string, formData: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.EVENTS.INDEX}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },
  getEventsComing: async (number: number) => {
    const res = await axiosInstance.get(
      `${API_URL.EVENTS.COMING}?number=${number}`
    );
    return res.data;
  },
  getEventsInMonth: async (month: number): Promise<EventsInMonth> => {
    const res = await axiosInstance.get(
      `${API_URL.EVENTS.IN_MONTH}?month=${month}`
    );
    return res.data;
  },
};
