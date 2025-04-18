import { Sort } from '@/enums/enums';
import { Book } from './book-types';
import { ApiListResponse, ApiResponse, BaseEntity } from './common-types';
import { ImageType } from './image-types';

export interface Publisher extends BaseEntity {
  publisherName: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  website?: string;
  images?: ImageType[];
  books: Book[];
  managerId?: string;
}

export type PublishersResponse = ApiListResponse<Publisher>;
export type PublisherResponse = ApiResponse<Publisher>;

export type PublisherSearch = {
  publisherName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

export interface PublisherParams {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
  result: {
    publisherName?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}
