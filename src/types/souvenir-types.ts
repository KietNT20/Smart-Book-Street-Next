import {
  ApiListResponse,
  ApiResponse,
  BaseEntity,
  PaginationSchema,
} from './common-types';

export interface Souvenir extends BaseEntity {
  souvenirName: string;
  description: string;
  baseImgUrl: string;
  price: number;
}

export type SouvenirParams = PaginationSchema<{ souvenirName?: string }>;
export type SouvenirResponse = ApiResponse<Souvenir>;
export type SouvenirsResponse = ApiListResponse<Souvenir>;
