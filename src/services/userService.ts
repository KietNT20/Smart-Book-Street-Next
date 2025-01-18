import { API_ENDPOINT } from '@/constant/api-url';
import axiosInstance from '@/utils/axiosInstance';

export const userService = {
  login(payload = {}) {
    return axiosInstance.post(`${API_ENDPOINT.USERS.LOGIN}`, payload);
  },
};
