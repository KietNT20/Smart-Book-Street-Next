import { ApiListResponse } from './common-types';
import { ImageType } from './image-types';

export type Street = {
  id: string;
  streetName: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  baseImgUrl: string;
  images: ImageType[];
};

export type StreetsResponse = ApiListResponse<Street>;
