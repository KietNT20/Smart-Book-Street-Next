import { OrderStatus, PaymentMethod } from '@/enums/enums';
import { ApiListResponse, ApiResponse, PaginationSchema } from './common-types';
import { Inventory } from './inventory-types';

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

export interface OrderParamsResult {
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: PaymentMethod;
  status?: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  storeId: string;
}

export type OrderParams = PaginationSchema<OrderParamsResult>;

export interface OrderDetail {
  id: string;
  productName: string;
  price: number;
  imgUrl: string;
  quantity: number;
  orderId: string;
  createdDate: Date | string;
  inventory: Inventory;
}
export interface Order {
  id: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  store: string;
  createdDate: Date | string;
  paymentLink: string;
  orderDetails: OrderDetail[];
}
export type OrderList = ApiListResponse<Order>;
export type OrderResponse = ApiResponse<Order>;

export interface OrderInfo {
  id: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  store: string;
  createdDate: Date | string;
  orderDetails: Cart[];
}

export type OrderInfoResponse = ApiListResponse<OrderInfo>;
