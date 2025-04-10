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

export type ZoneUpdate = Partial<Omit<Zone, 'id'>> & {
  streetId: string;
};

export interface ZonesResponse {
  results: Zone[];
  totalRecords: number;
  isSuccess: boolean;
  message: string;
}

export interface ZoneParams {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: Sort.ASC | Sort.DESC;
  result: {
    zoneName?: string;
    streetId?: string;
  };
}
