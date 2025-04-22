import { orderDetailService } from '@/services/orderDetailService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useOrderDetailMutation = () => {
  const queryClient = useQueryClient();

  const createOrderDetailMutation = useMutation({
    mutationKey: ['create-order-detail'],
    mutationFn: (data: FormData) => orderDetailService.create(data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['order-details'] });
      }
    },
    onError: (error) => {
      console.log('Error creating order detail:', error);
    },
  });

  const updateOrderDetailMutation = useMutation({
    mutationKey: ['update-order-detail'],
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      orderDetailService.update(id, quantity),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['order-details'] });
      }
    },
    onError: (error) => {
      console.log('Error updating order detail:', error);
    },
  });

  const deleteOrderDetailMutation = useMutation({
    mutationKey: ['delete-order-detail'],
    mutationFn: (id: string) => orderDetailService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['order-details'] });
        toast.success('Xóa sản phẩm khỏi đơn hàng thành công!');
      }
    },
    onError: (error) => {
      toast.error('Xóa sản phẩm khỏi đơn hàng thất bại!');
      console.log('Error deleting order detail:', error);
    },
  });

  return {
    createOrderDetail: createOrderDetailMutation.mutateAsync,
    deleteOrderDetail: deleteOrderDetailMutation.mutateAsync,
    updateOrderDetail: updateOrderDetailMutation.mutateAsync,
    createOrderDetailPending: createOrderDetailMutation.isPending,
    deleteOrderDetailPending: deleteOrderDetailMutation.isPending,
    updateOrderDetailPending: updateOrderDetailMutation.isPending,
    createOrderDetailError: createOrderDetailMutation.error,
    deleteOrderDetailError: deleteOrderDetailMutation.error,
    updateOrderDetailError: updateOrderDetailMutation.error,
  };
};

export const useOrderDetailCarts = (storeId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['order-details', storeId],
    queryFn: () => orderDetailService.cart(storeId),
    enabled: !!storeId,
  });

  return {
    orderDetailCarts: data?.results || [],
    isLoadingOrderDetailCarts: isLoading,
    orderDetailCartsError: error,
  };
};
