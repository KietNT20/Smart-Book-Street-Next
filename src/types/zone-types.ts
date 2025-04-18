import { Sort } from '@/enums/enums';
import { ApiListResponse, ApiResponse } from './common-types';

export interface Zone {
  id: string;
  zoneName: string;
  description: string;
  latitude: number;
  longitude: number;
}

export type ZoneCreate = Partial<Omit<Zone, 'id'>> & {
  streetId: string | null;
};

export type ZonesResponse = ApiListResponse<Zone>;
export type ZoneResponse = ApiResponse<Zone>;

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
