import { API_URL } from '@/constant/api-url';
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
};
