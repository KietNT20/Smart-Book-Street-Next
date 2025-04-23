import { PaymentMethod } from '@/enums/enums';
import { ApiListResponse, ApiResponse } from './common-types';
import { Inventory } from './inventory-types';
import { StoreData } from './store-types';

export interface OrderStaticsDailyAdmin {
  orderChart: OrderStaticValue[];
  orderProfit: OrderStaticValue[];
  totalOrder: number;
  totalProfit: number;
}

export interface OrderStaticValue {
  label: string;
  value: number;
}

export interface OrderDetailPayload {
  entityId: string;
}

export interface Cart {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imgUrl: string;
}

export type OrderCarts = ApiListResponse<Cart>;

export interface OrderParams {
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: PaymentMethod;
  status?: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  storeId: string;
}

export interface OrderDetail {
  id: string;
  orderId: string;
  createDate: Date | string;
  quantity: number;
  inventory: Inventory;
}
export interface Order {
  id: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  createdDate: Date | string;
  store: StoreData;
  paymentLink: string;
  orderDetails: OrderDetail[];
}

export type OrderList = ApiListResponse<Order>;
export type OrderResponse = ApiResponse<Order>;
