import { ApiListResponse } from './common-types';

export type Street = {
  id: string;
  streetName: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  baseImgUrl: string;
};

export type StreetsResponse = ApiListResponse<Street>;
