export interface BaseEntity {
  id: string;
  createdBy?: string | null;
  createdDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdatedDate?: string;
  isDeleted?: boolean;
}

export type PaginationSchema = {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: number;
};
