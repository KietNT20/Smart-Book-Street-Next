import { StoreRent, StoreRentLabels } from '@/enums/store-rent';
import { Trend } from '@/types/person-types';

export const getVietnameseRentLabel = (statusRent: StoreRent): string => {
  return StoreRentLabels[statusRent];
};

export const getChangeAmount = (
  total: number,
  percentChange?: number,
  trend?: Trend
): string => {
  if (percentChange === undefined || trend === undefined) {
    return '';
  }

  if (trend === Trend.STABLE || percentChange === 0) {
    return '(Không thay đổi)';
  }

  const changeAmount = Math.round((total * Math.abs(percentChange)) / 100);

  const formattedChangeAmount = new Intl.NumberFormat().format(changeAmount);

  if (trend === Trend.INCREASE) {
    return `(Tăng ${formattedChangeAmount} người)`;
  } else {
    return `(Giảm ${formattedChangeAmount} người)`;
  }
};
