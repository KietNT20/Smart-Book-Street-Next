import { API_URL } from '@/constant/api-url';
import {
  InventoriesResponse,
  InventoryCreate,
  InventoryScan,
} from '@/types/inventory-types';
import axiosInstance from '@/utils/axiosInstance';

export const inventoryService = {
  getAll: async () => {
    const res = await axiosInstance.get(API_URL.INVENTORIES.INDEX);
    return res.data;
  },
  getByBookId: async (bookId: string) => {
    const res = await axiosInstance.get(
      `${API_URL.INVENTORIES.BY_BOOK}/${bookId}`
    );
    return res.data;
  },
  getByStoreId: async (storeId: string): Promise<InventoriesResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.INVENTORIES.BY_STORE}/${storeId}`
    );
    return res.data;
  },
  create: async (data: InventoryCreate) => {
    const res = await axiosInstance.post(API_URL.INVENTORIES.INDEX, data);
    return res.data;
  },
  delete: async (bookId: string, storeId: string) => {
    const res = await axiosInstance.patch(
      `${API_URL.INVENTORIES.INDEX}/${bookId}/${storeId}`
    );
    return res.data;
  },
  scan: async (data: InventoryScan) => {
    const res = await axiosInstance.patch(API_URL.INVENTORIES.SCAN, data);
    return res.data;
  },
};
