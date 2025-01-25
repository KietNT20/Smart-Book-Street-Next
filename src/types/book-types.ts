import { BaseEntity } from './common-types';

export interface Book extends BaseEntity {
  code: string;
  title: string | null;
  publicationDate: string | null;
  price: number | null;
  languages: string | null;
  description: string | null;
  size: string | null;
  status: string | null;
  publisherId: string | null;
  // publisher?: any | null;
  // bookAuthors?: any[];
  // inventories?: any[];
  // bookCategories?: any[];
}

export interface GetAllBooksResponse {
  results: Book[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
}

export interface GetAllBooksPaginationResponse {
  results: Book[];
  totalPages: number;
  totalRecordsPerPage: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: number | string | null;
  isSuccess?: true;
  message?: string;
}
