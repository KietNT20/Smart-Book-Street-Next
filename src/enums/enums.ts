export enum Sort {
  ASC = 1,
  DESC = -1,
  DEFAULT = 0,
}

export enum PaymentMethod {
  CASH = 'Cash',
  TRANSFER = 'Transfer',
}

export enum OrderStatus {
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export const PaymentMethodLabel = {
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.TRANSFER]: 'Chuyển khoản',
};

export const OrderStatusLabel = {
  [OrderStatus.IN_PROGRESS]: 'Đang xử lý',
  [OrderStatus.COMPLETED]: 'Hoàn thành',
  [OrderStatus.CANCELLED]: 'Đã hủy',
};
