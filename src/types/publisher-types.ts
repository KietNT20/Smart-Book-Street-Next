import { Sort } from '@/enums/enums';
import { BaseEntity } from './common-types';
import { ImageType } from './image-types';

export interface Publisher extends BaseEntity {
  publisherName: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  website?: string;
  images?: ImageType[];
  managerId?: string;
}

export type PublishersResponse = {
  results: Publisher[];
  totalRecords: number;
  totalPages: number;
  isSuccess: boolean;
  message: string;
};

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
