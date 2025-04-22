import { ApiListResponse } from './common-types';

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
