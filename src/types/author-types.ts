import { Book } from './book-types';
import { BaseEntity } from './common-types';
import { Image } from './image-types';

export interface Author extends BaseEntity {
  id: string;
  authorName: string;
  dob: Date | string;
  nationality: string;
  biography: string;
  bookAuthors: BookAuthor[];
  images: Image[];
}

export interface BookAuthor {
  id: string;
  bookId: string;
  authorId: string;
  book: Book;
  author: Author | null;
  createdBy: string | null;
  createdDate: string;
  lastUpdatedBy: string | null;
  lastUpdatedDate: string | null;
  isDeleted: boolean;
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

export type AuthorResponse = {
  results: Author[];
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  isSuccess: boolean;
  message: string;
};
