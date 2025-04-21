import { DayOfWeek } from '@/enums/day-of-week';
import { Sort } from '@/enums/enums';
import { ApiListResponse, ApiResponse, BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Trend } from './person-types';
import { Zone } from './zone-types';

export interface StoreData extends BaseEntity {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  mainImageFile?: File;
  additionalImageFiles?: File[];
  latitude: number;
  longitude: number;
  type: string;
  zoneId: string;
  images: ImageType[];
  openingTime: string | null;
  closingTime: string | null;
  zone: Zone | null;
}

export interface StoreParams {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder: Sort;
  result: {
    storeName?: string;
    address?: string;
    phone?: string;
    email?: string;
    storeTheme?: string;
    type?: string;
  };
}

export type StoresResponse = ApiListResponse<StoreData & { id: string }>;
export type StoreResponse = ApiResponse<StoreData & { id: string }>;

export interface StoreSearchCriteria {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  storeTheme: string;
  type: string;
  zoneId?: string;
}

export interface StoreStatictisTotal {
  success: boolean;
  total: number;
  currentMonthPercentChange: number;
  changeDirection: Trend;
}

export interface StoreSchedulesPayload {
  storeId: string;
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  specialDate: Date | string | null;
}
