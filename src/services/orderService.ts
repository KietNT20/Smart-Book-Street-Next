import { API_URL } from '@/constant/api-url';
import { OrderStaticsDailyAdmin } from '@/types/order-types';
import axiosInstance from '@/utils/axiosInstance';

export const orderService = {
  getOrderStaticsDailyAdmin: async (
    date: string
  ): Promise<OrderStaticsDailyAdmin> => {
    const res = await axiosInstance.get(
      `${API_URL.ORDERS.STATISTICS_DAILY}?date=${date}`
    );
    return res.data;
  },
  getOrderStaticsMonthlyAdmin: async (
    month: number,
    year: number
  ): Promise<OrderStaticsDailyAdmin> => {
    const res = await axiosInstance.get(
      `${API_URL.ORDERS.STATISTICS_MONTHLY}/${month}/${year}`
    );
    return res.data;
  },

  getOrderStaticsYearlyAdmin: async (
    year: number
  ): Promise<OrderStaticsDailyAdmin> => {
    const res = await axiosInstance.get(
      `${API_URL.ORDERS.STATISTICS_YEARLY}/${year}`
    );
    return res.data;
  },
};
