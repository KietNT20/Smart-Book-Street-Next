import { Sort } from '@/enums/enums';

export interface Zone {
  id: string;
  zoneName: string;
  description: string;
  isDeleted: boolean;
  latitude: number;
  longitude: number;
}

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
