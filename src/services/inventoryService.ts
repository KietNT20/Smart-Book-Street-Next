import { BooksNextResponse } from '@/app/api/stores/[storeId]/books/route';
import { SouvenirsNextResponse } from '@/app/api/stores/[storeId]/souvenirs/route';
import { API_URL } from '@/constant/api-url';
import { NextJS_API } from '@/enums/endpoint';
import {
  InventoriesResponse,
  InventoryCreate,
  InventoryScan,
} from '@/types/inventory-types';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';

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
  getBookByStoreId: async (storeId: string): Promise<InventoriesResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.INVENTORIES.BY_STORE}/${storeId}/books`
    );
    return res.data;
  },
  getSouvenirByStoreId: async (
    storeId: string
  ): Promise<InventoriesResponse> => {
    const res = await axiosInstance.get(
      `${API_URL.INVENTORIES.BY_STORE}/${storeId}/souvenirs`
    );
    return res.data;
  },
  getBookNextByStoreId: async (storeId: string): Promise<BooksNextResponse> => {
    const res = await axios.get(`${NextJS_API.STORES}/${storeId}/books`);
    return res.data;
  },
  getSouvenirNextByStoreId: async (
    storeId: string
  ): Promise<SouvenirsNextResponse> => {
    const res = await axios.get(`${NextJS_API.STORES}/${storeId}/souvenirs`);
    return res.data;
  },
  getBookInfoInventory: async (storeId: string, isbn: string) => {
    const res = await axios.get(
      `${NextJS_API.STORES}/${storeId}/books/${isbn}`
    );
    return res.data;
  },
  create: async (data: InventoryCreate) => {
    const res = await axiosInstance.post(API_URL.INVENTORIES.INDEX, data);
    return res.data;
  },
  update: async (entityId: string, storeId: string, data: FormData) => {
    const res = await axiosInstance.put(
      `${API_URL.INVENTORIES.INDEX}/${entityId}/${storeId}`,
      data
    );
    return res.data;
  },
  delete: async (entityId: string, storeId: string) => {
    const res = await axiosInstance.patch(
      `${API_URL.INVENTORIES.INDEX}/${entityId}/${storeId}`
    );
    return res.data;
  },
  scan: async (data: InventoryScan) => {
    const res = await axiosInstance.patch(API_URL.INVENTORIES.SCAN, data);
    return res.data;
  },
};
