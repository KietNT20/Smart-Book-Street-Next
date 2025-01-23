export interface BaseEntity {
  id: string;
  createdBy?: string | null;
  createdDate?: string;
  lastUpdatedBy?: string | null;
  lastUpdatedDate?: string;
  isDeleted?: boolean;
}
