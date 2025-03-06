import { Book } from './book-types';
import { BaseEntity } from './common-types';
import { Image } from './image-types';

export interface Author extends BaseEntity {
  authorName: string;
  dob: Date | string;
  nationality: string;
  biography: string;
  bookAuthors: BookAuthor[];
  images: Image[];
}

export interface BookAuthor extends BaseEntity {
  bookId: string;
  authorId: string;
  book: Book;
  author: Author | null;
}

export type AuthorPayload = Omit<Author, 'id' | 'images' | 'bookAuthors'>;

export type SearchPaginationAuthor = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
  result: {
    authorName: string;
  };
};

export type AuthorsApiResponse = {
  results: Author[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  isSuccess: boolean;
  message: string;
};

export type AuthorApiResponse = {
  result: Author;
  isSuccess: boolean;
  message: string;
};
