import { Book } from './book-types';
import { ApiListResponse, ApiResponse, BaseEntity } from './common-types';
import { ImageType } from './image-types';
import { Souvenir } from './souvenir-types';
import { StoreData } from './store-types';

export interface InventoryItem extends BaseEntity {
  entityId: string;
  storeId: string;
  quantity: number;
  isInStock: boolean;
}

export interface InventoryItemCreate {
  entityId: string;
  storeId: string;
  quantity: number;
  isInStock: boolean;
}

export interface Inventory extends BaseEntity {
  id: string;
  entityId: string;
  storeId: string;
  quantity: number;
  isInStock: boolean;
  book: Book & { id: string };
  souvenir: Souvenir & { id: string };
  store: StoreData & { id: string };
  images: ImageType[];
}

export type InventoriesResponse = ApiListResponse<Inventory & { id: string }>;
export type InventoryResponse = ApiResponse<Inventory & { id: string }>;

export interface InventoryCreate {
  entityId: string;
  storeId: string;
  quantity: number;
  isInStock: boolean;
}

export type InventoryScan = {
  isbn: string;
  storeId: string;
  quantity: number;
};
