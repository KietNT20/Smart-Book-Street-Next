import { BaseEntity } from './common-types';

export interface Book extends BaseEntity {
  code: string;
  title: string;
  publicationDate: string;
  price: number;
  languages: string;
  description?: string;
  size?: string;
  status: string;
  publisherId: string;
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

export interface BookSearchResult {
  results: Book[];
  totalPages: number;
  totalRecordsPerPage: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  sortField: string | null;
  sortOrder: number | null;
  isSuccess: boolean;
  message: string;
}

export interface BookSearchCriteria {
  code?: string;
  title?: string;
  publicationDate?: string;
  price?: number;
  languages?: string;
  size?: string;
  status?: string;
}

export interface BookSearchPayload {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: number;
  result?: Partial<BookSearchCriteria>;
}
