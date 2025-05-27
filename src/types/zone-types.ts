import { Sort } from '@/enums/enums';
import { ApiListResponse, ApiResponse, BaseEntity } from './common-types';
import { Street } from './street-types';

export interface Zone extends BaseEntity {
  id: string;
  zoneName: string;
  description: string;
  latitude: number;
  longitude: number;
  street: Street | null;
}

export type ZoneCreate = Partial<Omit<Zone, 'id'>> & {
  streetId: string | null;
};

export type ZonesResponse = ApiListResponse<Zone & { id: string }>;
export type ZoneResponse = ApiResponse<Zone & { id: string }>;

export interface ZoneParams {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
  result: {
    zoneName?: string;
    streetId?: string | null;
  };
}

export interface ZoneSearchStoreParams {
  pageNumber: number;
  result: {
    zoneName?: string;
    streetId?: string;
  };
}
