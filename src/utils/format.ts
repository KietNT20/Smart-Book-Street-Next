import { StoreRent, StoreRentLabels } from '@/enums/store-rent';

export const getVietnameseRentLabel = (statusRent: StoreRent): string => {
  return StoreRentLabels[statusRent];
};
