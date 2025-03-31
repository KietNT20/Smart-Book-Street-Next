import { Sort } from '@/enums/enums';
import { BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Publisher } from './publisher-types';

export type BookAuthorIds = {
  id: string;
  authorId: string;
  bookId: string;
};

export type BookCategoryIds = {
  id: string;
  categoryId: string;
  bookId: string;
};

export interface Book extends BaseEntity {
  id: string;
  code: string;
  title: string;
  publicationDate: Date | string;
  price: number;
  languages: string;
  description: string;
  size: string;
  status: string;
  publisherId: string;
  authorIds: string[];
  categoryIds: string[];
  publisher?: Publisher;
  baseImgUrl?: string;
  images?: ImageType[];
  bookAuthors: BookAuthorIds[];
  bookCategories: BookCategoryIds[];
  inventories?: any[];
}

export type GetAllBooksResponse = {
  results: Book[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};

export type BookResponse = {
  results: Book[];
  totalPages: number;
  totalRecordsPerPage: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort.ASC | Sort.DESC;
  isSuccess: true;
  message: string;
};

export type BookSearchResult = {
  results: Book[];
  totalPages: number;
  totalRecordsPerPage: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort.ASC | Sort.DESC;
  isSuccess: boolean;
  message: string;
};

export type BookSearchCriteria = {
  code?: string;
  title?: string;
  price?: number;
  languages?: string;
  size?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
};

export type BookPaginated = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort.ASC | Sort.DESC;
};

export type BookSearchPagination = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort.ASC | Sort.DESC;
  result?: Partial<BookSearchCriteria>;
};
