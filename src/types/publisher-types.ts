import { Sort } from '@/enums/enums';
import { BaseEntity } from './common-types';

export interface Publisher extends BaseEntity {
  publisherName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
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
  sortOrder: Sort.ASC | Sort.DESC;
  result: {
    publisherName?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}
