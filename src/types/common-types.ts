import { Sort } from '@/enums/enums';

export type BaseEntity = {
  id?: string;
  createdBy?: string;
  createdDate?: Date | string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date | string;
  isDeleted?: boolean;
};

export type PaginationSchema = {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: Sort.ASC | Sort.DESC;
};
