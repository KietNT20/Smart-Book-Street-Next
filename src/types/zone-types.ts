import { Sort } from '@/enums/enums';

export interface Zone {
  id: string;
  zoneName: string;
  description: string;
  latitude: number;
  longitude: number;
}

export type ZoneCreate = Partial<Omit<Zone, 'id'>> & {
  streetId: string;
};

export interface ZonesResponse {
  results: Zone[];
  totalRecords: number;
  totalPages: number;
  isSuccess: boolean;
  message: string;
}

export interface ZoneResponse {
  result: Zone[];
  isSuccess: boolean;
  message: string;
}

export interface ZoneParams {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort;
  result: {
    zoneName?: string;
    streetId?: string;
  };
}
