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
  authorIds: string[];
  categoryIds: string[];
  // publisher?: any | null;
  // bookAuthors?: any[];
  // inventories?: any[];
  // bookCategories?: any[];
}

export type GetAllBooksResponse = {
  results: Book[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};

export type GetAllBooksPaginationResponse = {
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
};

export type BookSearchResult = {
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
};

export type BookSearchCriteria = {
  code?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  languages?: string;
  size?: string;
  status?: string;
};

export type BookSearchPayload = {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: number;
  result?: Partial<BookSearchCriteria>;
};
