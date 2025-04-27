import { API_URL } from '@/constant/api-url';
import { EventRegistrationsResponse } from '@/types/event-registrations-types';
import axiosInstance from '@/utils/axiosInstance';

export const eventRegistrationService = {
  getAll: async (eventId: string): Promise<EventRegistrationsResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.EVENT_REGISTRATIONS.GET_ALL}/${eventId}`
    );
    return res.data;
  },
  statistic: async (eventId: string) => {
    const res = await axiosInstance.get(
      `${API_URL.EVENT_REGISTRATIONS.STATISTIC}/${eventId}`
    );
    return res.data;
  },
  checkAttendend: async (payload: { id: string; isAttended: boolean }) => {
    const res = await axiosInstance.put(
      `${API_URL.EVENT_REGISTRATIONS.INDEX}/check-attended`,
      payload
    );
    return res.data;
  },
};
