import { Sort } from '@/enums/enums';
import { BaseEntity } from './common-types';

export interface StoreData extends BaseEntity {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
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
    bookStoreName?: string;
    address?: string;
    phone?: string;
    email?: string;
    openingTime?: string | null;
    closingTime?: string | null;
  };
}
