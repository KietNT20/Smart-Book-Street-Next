import { Image } from './image-types';

export type Author = {
  id: string;
  authorName: string;
  dob: Date | string;
  nationality: string;
  biography: string;
  images: Image[];
};

export type AuthorPayload = Omit<Author, 'id' | 'images'>;

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
