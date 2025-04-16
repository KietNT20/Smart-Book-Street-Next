import { Sort } from '@/enums/enums';
import { Language } from '@/enums/lang';
import { BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Publisher } from './publisher-types';

export type BookAuthor = {
  id: string;
  authorId: string;
  bookId: string;
  authorName: string;
  isNewAuthor: boolean;
};

export type BookCategories = {
  id: string;
  categoryId: string;
  bookId: string;
  categoryName: string;
  isNewCategory: boolean;
};

export interface Book extends BaseEntity {
  isbn: string;
  title: string;
  publicationDate: Date | string | null;
  price: number;
  languages: Language;
  description: string;
  size: string;
  status: string;
  publisherId: string;
  authorIds: string[];
  categoryIds: string[];
  mainImageFile: File | null;
  additionalImageFiles: File[] | null;
  publisher?: Publisher;
  baseImgUrl?: string;
  images?: ImageType[];
  bookAuthors: BookAuthor[];
  bookCategories: BookCategories[];
  inventories?: any[];
}

export type GetAllBooksResponse = {
  results: Book[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};

export type BooksResponse = {
  results: Book[];
  totalPages: number;
  totalRecordsPerPage: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  isSuccess: true;
  message: string;
};

export type BookResponse = {
  result: Book;
  totalRecords: number;
  isSuccess: true;
  message: string;
};

export type BookSearchCriteria = {
  isbn?: string;
  title?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  languages?: string;
  size?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  authorId?: string;
};

export type BookPaginated = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
};

export type BookSearchPagination = {
  pageNumber: number;
  pageSize: number;
  sortField?: string;
  sortOrder: Sort;
  result?: Partial<BookSearchCriteria>;
};
