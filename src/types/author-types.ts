import { Sort } from '@/enums/enums';
import { Book } from './book-types';
import { BaseEntity } from './common-types';
import { ImageType } from './image-types';

export interface Author extends BaseEntity {
  id: string;
  authorName: string;
  dob: Date | string;
  nationality: string;
  biography: string;
  bookAuthors: BookAuthor[];
  baseImgUrl?: string;
  images: ImageType[];
}

export interface BookAuthor extends BaseEntity {
  bookId: string;
  authorId: string;
  book: Book;
  author: Author | null;
}

export type AuthorSearchPagination = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
  result: {
    authorName: string;
  };
};

export type BookAuthorSearchPagination = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
  result: {
    key: string;
    authorId: string;
    bookId: string;
  };
};

export type BookAuthorPaginated = {
  key: string;
  authorId: string;
  bookId: string;
};

export type AuthorsResponse = {
  results: Author[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  isSuccess: boolean;
  message: string;
};

export type AuthorResponse = {
  result: Author;
  isSuccess: boolean;
  message: string;
};
