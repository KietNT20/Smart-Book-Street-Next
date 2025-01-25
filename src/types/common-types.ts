export interface BaseEntity {
  id?: string;
  createdBy?: string;
  createdDate?: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
  isDeleted?: boolean;
}

export type PaginationSchema = {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: -1 | 0 | 1;
};
