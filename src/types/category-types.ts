import { Sort } from '@/enums/enums';
import { Book } from './book-types';
import { ApiListResponse, ApiResponse, BaseEntity } from './common-types';

export interface Category extends BaseEntity {
  categoryName: string;
  description: string;
  bookCategories: {
    bookId: string;
    categoryId: string;
    category: Category | null;
    book: Book;
  }[];
}

export type CategorySearchPagination = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
  result: {
    categoryName: string;
  };
};

export type CategoriesResponse = ApiListResponse<Category & { id: string }>;
export type CategoryResponse = ApiResponse<Category & { id: string }>;
