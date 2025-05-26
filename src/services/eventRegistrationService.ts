import { API_URL } from '@/constant/api-url';
import {
  CheckedAttendendPayload,
  EventRegistrationsResponse,
  EventRegistrationStatistic,
  EventRegistrationStatisticParams,
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
    params?: EventRegistrationStatisticParams
  ): Promise<EventRegistrationStatistic> => {
    const queryParams: any = {};

    if (params?.isAttended !== undefined) {
      queryParams.isAttended = params.isAttended;
    }

    if (params?.province) {
      queryParams.province = params.province;
    }

    if (params?.district) {
      queryParams.district = params.district;
    }

    if (params?.date) {
      queryParams.date = params.date;
    }

    const res = await axiosInstance.get(
      `${API_URL.EVENT_REGISTRATIONS.STATISTIC}/${eventId}`,
      {
        params: queryParams,
      }
    );
    return res.data;
  },
  checkAttendend: async (payload: CheckedAttendendPayload) => {
    const res = await axiosInstance.put(
      API_URL.EVENT_REGISTRATIONS.CHECK_ATTENDEND,
      payload
    );
    return res.data;
  },
  exportStatisticEventRegistrations: async (eventId: string, email: string) => {
    const res = await axiosInstance.get(
      `${API_URL.EVENT_REGISTRATIONS.EXPORT_STATISTIC}/${eventId}?email=${email}`
    );
    return res.data;
  },
};
