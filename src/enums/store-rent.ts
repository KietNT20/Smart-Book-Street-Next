export enum StoreRent {
  ACTIVE = 'Active',
  TERMINATED = 'Terminated',
  EXPIRED = 'Expired',
}
export const StoreRentLabels: Record<StoreRent, string> = {
  [StoreRent.ACTIVE]: 'Đang thuê',
  [StoreRent.TERMINATED]: 'Ngừng thuê',
  [StoreRent.EXPIRED]: 'Hết hạn',
};
