import {
  ApiListResponse,
  ApiResponse,
  BaseEntity,
  PaginationSchema,
} from './common-types';
import { ImageType } from './image-types';
import { Zone } from './zone-types';

export interface Street extends BaseEntity {
  id: string;
  streetName: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  baseImgUrl: string;
  zones?: Zone[];
  images: ImageType[];
  isDeleted: boolean;
}

export type StreetParams = PaginationSchema<{ key?: string }>;
export type StreetsResponse = ApiListResponse<Street>;
export type StreetResponse = ApiResponse<Street>;
