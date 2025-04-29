import { Sort } from '@/enums/enums';
import { Language } from '@/enums/lang';
import { ApiListResponse, ApiResponse, BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Inventory } from './inventory-types';
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
  inventories?: Inventory[];
}

export type GetAllBooksResponse = {
  results: Book[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
};

export type BooksResponse = ApiListResponse<Book & { id: string }>;
export type BookResponse = ApiResponse<Book & { id: string }>;

export type BookSearchCriteria = {
  isbn?: string;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  languagesList?: string[];
  size?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  authorIds?: string[];
  categoryIds?: string[];
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
  result: Partial<BookSearchCriteria>;
};

export interface BookNextjs {
  entityId: string;
  isbn: string;
  title: string;
  publicationDate: Date | string | null;
  price: number;
  languages: string;
  description: string;
  size: string;
  status: string;
  id: string;
  inventoryId: string;
  quantity: number;
  isInStock: boolean;
}
