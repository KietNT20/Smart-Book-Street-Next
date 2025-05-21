import { API_URL } from '@/constant/api-url';
import {
  CheckedAttendendPayload,
  EventRegistrationsResponse,
  EventRegistrationStatistic,
} from '@/types/event-registrations-types';
import axiosInstance from '@/utils/axiosInstance';

export const eventRegistrationService = {
  getAll: async (eventId: string): Promise<EventRegistrationsResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.EVENT_REGISTRATIONS.GET_ALL}/${eventId}`
    );
    return res.data;
  },
  statistic: async (
    eventId: string,
    isAttended?: boolean
  ): Promise<EventRegistrationStatistic> => {
    const res = await axiosInstance.get(
      `${API_URL.EVENT_REGISTRATIONS.STATISTIC}/${eventId}`,
      {
        params: {
          ...(isAttended && { isAttended }),
        },
      }
    );
    return res.data;
  },
  checkAttendend: async (payload: CheckedAttendendPayload) => {
    const res = await axiosInstance.put(
      `${API_URL.EVENT_REGISTRATIONS.INDEX}/check-attendend`,
      payload
    );
    return res.data;
  },
};
