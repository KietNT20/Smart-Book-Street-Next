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
  baseImgFile?: string | null;
  otherImgFiles?: string[] | null;
}

export type SouvenirParams = PaginationSchema<{ souvenirName?: string }>;
export type SouvenirResponse = ApiResponse<Souvenir & { id: string }>;
export type SouvenirsResponse = ApiListResponse<Souvenir & { id: string }>;

export interface SouvenirNextjs {
  souvenirName: string;
  description: string;
  price: number;
  entityId: string;
  inventoryId: string;
  quantity: number;
  isInStock: boolean;
}
