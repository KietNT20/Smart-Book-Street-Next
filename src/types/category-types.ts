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

export type SearchPaginationCategory = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: -1 | 0 | 1;
  result: {
    categoryName: string;
  };
};
