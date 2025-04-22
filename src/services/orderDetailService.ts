import { API_URL } from '@/constant/api-url';
import { OrderCarts } from '@/types/order-types';
import axiosInstance from '@/utils/axiosInstance';

export const orderDetailService = {
  create: async (data: FormData) => {
    const res = await axiosInstance.post(API_URL.ORDER_DETAILS.INDEX, data);
    return res.data;
  },
  update: async (id: string, quantity: number) => {
    const res = await axiosInstance.put(
      `${API_URL.ORDER_DETAILS.INDEX}/${id}?quantity=${quantity}`
    );
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.delete(
      `${API_URL.ORDER_DETAILS.INDEX}/${id}`
    );
    return res.data;
  },
  cart: async (storeId: string): Promise<OrderCarts> => {
    const res = await axiosInstance.get(
      `${API_URL.ORDER_DETAILS.CART}/${storeId}`
    );
    return res.data;
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`${API_URL.ORDER_DETAILS.INDEX}/${id}`);
    return res.data;
  },
  search: async (params: {
    orderId?: string;
    storeId?: string;
    entityId?: string;
  }) => {
    const res = await axiosInstance.post(
      `${API_URL.ORDER_DETAILS.SEARCH}`,
      params
    );
    return res.data;
  },
};
