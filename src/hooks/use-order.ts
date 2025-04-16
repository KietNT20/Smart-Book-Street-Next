import { orderService } from '@/services/orderService';
import { useQuery } from '@tanstack/react-query';

export const useOrderStaticsDailyAdmin = (date: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsDailyAdmin', date],
    queryFn: () => orderService.getOrderStaticsDailyAdmin(date),
  });
  return {
    orderStaticsDailyAdmin: data,
    orderDailyLoading: isLoading,
    orderDailyError: isError,
  };
};

export const useOrderStaticsMonthlyAdmin = (month: number, year: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsMonthlyAdmin', month, year],
    queryFn: () => orderService.getOrderStaticsMonthlyAdmin(month, year),
  });
  return {
    orderStaticsMonthlyAdmin: data,
    orderMonthlyLoading: isLoading,
    orderMonthlyError: isError,
  };
};

export const useOrderStaticsYearAdmin = (year: number) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsYearAdmin', year],
    queryFn: () => orderService.getOrderStaticsYearlyAdmin(year),
  });
  return {
    orderStaticsYearAdmin: data,
    orderYearLoading: isLoading,
    orderYearError: isError,
  };
};
