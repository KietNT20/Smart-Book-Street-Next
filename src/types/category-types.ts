import { Sort } from '@/enums/enums';
import { Book } from './book-types';
import { BaseEntity } from './common-types';

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
  sortOrder: Sort.ASC | Sort.DESC;
  result: {
    categoryName: string;
  };
};
