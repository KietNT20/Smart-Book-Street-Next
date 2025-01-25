import { API_ENDPOINT } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const imageService = {
  add(payload = {}) {
    return axiosInstance.post(`${API_ENDPOINT.IMAGES.ADD}`, payload);
  },
};
