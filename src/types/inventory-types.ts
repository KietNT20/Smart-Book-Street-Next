import { BaseEntity } from './common-types';

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
