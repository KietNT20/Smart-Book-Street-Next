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
