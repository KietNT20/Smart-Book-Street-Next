import { BaseEntity } from './common-types';

export interface Publisher extends BaseEntity {
  publisherName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
}

export type PublisherResponse = {
  results: Publisher[];
  totalRecords: number;
  isSuccess: boolean;
};
