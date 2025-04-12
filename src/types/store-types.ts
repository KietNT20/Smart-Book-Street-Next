import { Sort } from '@/enums/enums';
import { BaseEntity } from './common-types';

export interface StoreData extends BaseEntity {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  mainImageFile: string;
  additionalImageFiles: string[];
  latitude: number;
  longitude: number;
  type: string;
  zoneId: string;
}

export interface StoreParams {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder: Sort.ASC | Sort.DESC;
  result: {
    storeName?: string;
    address?: string;
    phone?: string;
    email?: string;
    storeTheme?: string;
    type?: string;
  };
}

export interface StoresResponse {
  results: StoreData[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  isSuccess: boolean;
  message: string;
}

export interface StoreResponse {
  result: StoreData;
  isSuccess: boolean;
  message: string;
}

export interface StoreSearchCriteria {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  storeTheme: string;
  type: string;
}
