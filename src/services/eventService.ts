import { API_URL } from '@/constant/api-url';
import {
  EventCreateReqParams,
  EventDetailResponse,
  EventInDateResponse,
  EventParams,
  EventResponseAll,
  EventsInMonth,
  EventsResponse,
  EventStaffParams,
  EventStaticsInMonth,
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
  getStatisticInMonth: async (month: number): Promise<EventStaticsInMonth> => {
    const res = await axiosInstance.get(
      `${API_URL.EVENTS.STATISTICS}?month=${month}`
    );
    return res.data;
  },
  getEventInDate: async (date: string): Promise<EventInDateResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.EVENTS.EVENTS_IN_DATE}?date=${date}`
    );
    return res.data;
  },
  eventOpenState: async (id: string) => {
    const res = await axiosInstance.put(
      `${API_URL.EVENTS.EVENT_OPEN_STATE}/${id}`
    );
    return res.data;
  },
  eventProcessRequest: async (id: string, data: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.EVENTS.PROCESS_REQUEST}/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },
  getEventsInDateForCheckin: async (
    params: EventStaffParams
  ): Promise<EventsResponse> => {
    const res = await axiosInstance.post(
      API_URL.EVENTS.EVENTS_IN_DATE_FOR_CHECKIN,
      params
    );
    return res.data;
  },
  getEventCreationsHistory: async (
    params: EventCreateReqParams
  ): Promise<EventsResponse> => {
    const res = await axiosInstance.post(
      API_URL.EVENTS.GET_EVENT_CREATIONS_HISTORY,
      params
    );
    return res.data;
  },
  getAllEventCreateRequests: async (
    params: EventCreateReqParams
  ): Promise<EventsResponse> => {
    const res = await axiosInstance.post(
      API_URL.EVENTS.GET_ALL_EVENT_CREATE_REQUESTS,
      params
    );
    return res.data;
  },
  getRequestHistoryDetail: async (id: string): Promise<EventResponseAll> => {
    const res = await axiosInstance.get(
      `${API_URL.EVENTS.REQUEST_HISTORY}/${id}`
    );
    return res.data;
  },
};
