import { API_URL } from '@/constant/api-url';
import {
  EventDetailResponse,
  EventParams,
  EventsInMonth,
  EventsResponse,
} from '@/types/event-types';
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
  delete: async (id: string) => {
    const res = await axiosInstance.patch(`${API_URL.EVENTS.INDEX}/${id}`);
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
  getEvents: async (params: EventParams): Promise<EventsResponse> => {
    const res = await axiosInstance.post(
      API_URL.EVENTS.PAGINATION_SEARCH,
      params
    );
    return res.data;
  },
  getEventById: async (id: string): Promise<EventDetailResponse> => {
    const res = await axiosInstance.get(`${API_URL.EVENTS.INDEX}/${id}`);
    return res.data;
  },
};
