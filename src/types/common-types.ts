import { Sort } from '@/enums/enums';

export type BaseEntity = {
  id?: string;
  createdBy?: string;
  createdDate?: Date | string | null;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date | string | null;
  isDeleted?: boolean;
};

export type PaginationSchema<T> = {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: Sort;
  result: T;
};

export enum StatusBook {
  UPDATED = 'UPDATED',
}

export interface ApiListResponse<T> {
  results: T[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  isSuccess: boolean;
  message: string;
}

export interface ApiResponse<T> {
  result: T;
  isSuccess: boolean;
  message: string;
}

export interface ApiResponseAll<T> {
  results: T[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
}
