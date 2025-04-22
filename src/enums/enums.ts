export enum Sort {
  ASC = 1,
  DESC = -1,
  DEFAULT = 0,
}

export enum PaymentMethod {
  CASH = 'Cash',
  TRANSFER = 'Transfer',
}

export const PaymentMethodLabel = {
  [PaymentMethod.CASH]: 'Tiền mặt',
  [PaymentMethod.TRANSFER]: 'Chuyển khoản',
};
