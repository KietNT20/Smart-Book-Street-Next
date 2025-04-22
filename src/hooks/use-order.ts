import { orderService } from '@/services/orderService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useOrderStaticsDailyStore = (date: string, storeId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsDailyStore', date, storeId],
    queryFn: () => orderService.getOrderStaticsDailyStore(date, storeId),
    enabled: !!storeId,
  });

  if (storeId) {
    queryClient.prefetchQuery({
      queryKey: ['orderStaticsDailyStore', date, storeId],
      queryFn: () => orderService.getOrderStaticsDailyStore(date, storeId),
    });
  }

  return {
    orderStaticsDailyStore: data,
    orderDailyLoading: isLoading,
    orderDailyError: isError,
  };
};

export const useOrderStaticsMonthlyStore = (
  month: number,
  year: number,
  storeId: string
) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsMonthlyStore', month, year, storeId],
    queryFn: () =>
      orderService.getOrderStaticsMonthlyStore(month, year, storeId),
    enabled: !!storeId,
  });

  if (storeId) {
    queryClient.prefetchQuery({
      queryKey: ['orderStaticsMonthlyStore', month, year, storeId],
      queryFn: () =>
        orderService.getOrderStaticsMonthlyStore(month, year, storeId),
    });
  }

  return {
    orderStaticsMonthlyStore: data,
    orderMonthlyLoading: isLoading,
    orderMonthlyError: isError,
  };
};

export const useOrderStaticsYearlyStore = (year: number, storeId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsYearlyStore', year, storeId],
    queryFn: () => orderService.getOrderStaticsYearlyStore(year, storeId),
    enabled: !!storeId,
  });

  if (storeId) {
    queryClient.prefetchQuery({
      queryKey: ['orderStaticsYearlyStore', year, storeId],
      queryFn: () => orderService.getOrderStaticsYearlyStore(year, storeId),
    });
  }

  return {
    orderStaticsYearlyStore: data,
    orderYearLoading: isLoading,
    orderYearError: isError,
  };
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createOrder, isPending } = useMutation({
    mutationKey: ['create-order'],
    mutationFn: (data: FormData) => orderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-details'] });
    },
    onError: (error) => {
      console.log('Error creating order:', error);
    },
  });

  return {
    createOrder,
    createOrderPending: isPending,
  };
};
