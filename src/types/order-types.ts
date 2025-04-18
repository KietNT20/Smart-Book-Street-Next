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
