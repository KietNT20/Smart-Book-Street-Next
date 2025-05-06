import { STORAGE } from '@/constant/storage';
import { orderService } from '@/services/orderService';
import { getLocalStorageItem } from '@/utils/token';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { OrderParams } from './../types/order-types';

export const useOrderStaticsDailyAdmin = (date: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsDailyAdmin', date],
    queryFn: () => orderService.getOrderStaticsDailyAdmin(date),
    staleTime: 0,
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
    staleTime: 0,
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
    staleTime: 0,
  });
  return {
    orderStaticsYearAdmin: data,
    orderYearLoading: isLoading,
    orderYearError: isError,
  };
};

export const useOrderStaticsDailyStore = (date: string) => {
  const queryClient = useQueryClient();
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsDailyStore', date, storeId],
    queryFn: () => orderService.getOrderStaticsDailyStore(date, storeId),
    staleTime: 0,
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

export const useOrderStaticsMonthlyStore = (month: number, year: number) => {
  const queryClient = useQueryClient();
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsMonthlyStore', month, year, storeId],
    queryFn: () =>
      orderService.getOrderStaticsMonthlyStore(month, year, storeId),
    staleTime: 0,
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

export const useOrderStaticsYearlyStore = (year: number) => {
  const queryClient = useQueryClient();
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderStaticsYearlyStore', year, storeId],
    queryFn: () => orderService.getOrderStaticsYearlyStore(year, storeId),
    staleTime: 0,
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
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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

export const useGetOrderById = (orderId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
  });
  return {
    order: data?.result,
    orderLoading: isLoading,
    orderError: isError,
  };
};

export const useGetOrdersSearchPagination = ({
  result,
  sortField,
  sortOrder,
  pageSize,
  pageNumber,
}: OrderParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', result, sortField, sortOrder, pageSize, pageNumber],
    queryFn: () =>
      orderService.getSearchPagination({
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
    placeholderData: keepPreviousData,
  });

  const totalPage = data?.totalPages || 0;

  if (totalPage > pageNumber) {
    queryClient.prefetchQuery({
      queryKey: [
        'orders',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        orderService.getSearchPagination({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber + 1,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'orders',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        orderService.getSearchPagination({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    orders: data?.results || [],
    ordersLoading: isLoading,
    ordersError: isError,
    totalPage,
  };
};

export const useOrderStatusMuatation = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateOrderStatus,
    isPending: updateOrderStatusPending,
  } = useMutation({
    mutationKey: ['update-order-status'],
    mutationFn: (orderId: string) => orderService.confirmOrder(orderId),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['inventories-book'] });
        queryClient.invalidateQueries({ queryKey: ['inventories-souvenir'] });
        toast.success('Xác nhận đơn hàng thành công');
      }
    },
    onError: (error) => {
      console.log('Error confirm order:', error);
      toast.error('Xác nhận đơn hàng thất bại');
    },
  });

  const { mutateAsync: cancelOrderStatus, isPending: isOrderCancelPending } =
    useMutation({
      mutationKey: ['cancel-order-status'],
      mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['inventories-book'] });
          queryClient.invalidateQueries({ queryKey: ['inventories-souvenir'] });
          toast.success('Đơn hàng đã được hủy');
        }
      },
      onError: (error) => {
        console.log('Error cancel order:', error);
        toast.error('Đơn hàng không thể hủy');
      },
    });

  return {
    updateOrderStatus,
    updateOrderStatusPending,
    cancelOrderStatus,
    isOrderCancelPending,
  };
};
