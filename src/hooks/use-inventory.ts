import { inventoryService } from '@/services/inventoryService';
import { InventoryCreate } from '@/types/inventory-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const useInventoryByStoreId = (storeId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventories', storeId],
    queryFn: () => inventoryService.getByStoreId(storeId),
    enabled: !!storeId,
  });

  return {
    inventoriesByStoreId: data?.results || [],
    isLoading,
    error,
  };
};

export const useInventoryBooksByStoreId = (storeId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventories', storeId],
    queryFn: () => inventoryService.getBookByStoreId(storeId),
    enabled: !!storeId,
  });

  return {
    inventoriesByStoreId: data?.results || [],
    isLoading,
    error,
  };
};

export const useInventorySouvenirsByStoreId = (storeId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventories', storeId],
    queryFn: () => inventoryService.getSouvenirByStoreId(storeId),
    enabled: !!storeId,
  });

  return {
    inventoriesByStoreId: data?.results || [],
    isLoading,
    error,
  };
};

export const useInventoryMutation = () => {
  const queryClient = useQueryClient();

  const createQuantityMutation = useMutation({
    mutationKey: ['create-inventory'],
    mutationFn: ({ entityId, storeId, quantity, isInStock }: InventoryCreate) =>
      inventoryService.create({ entityId, storeId, quantity, isInStock }),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ['inventories', data.storeId],
        });
        toast.success('Thêm sản phẩm vào kho thành công');
      }
    },
    onError: (error) => {
      toast.error(`${error.message}`);
      console.log('Error adding product to inventory:', error);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationKey: ['update-inventory'],
    mutationFn: ({
      entityId,
      storeId,
      data,
    }: {
      entityId: string;
      storeId: string;
      data: FormData;
    }) => inventoryService.update(entityId, storeId, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ['inventories', data.storeId],
        });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(`${error.response?.data?.message}`);
      console.log('Error updating quantity product:', error);
    },
  });

  return {
    addProductToStore: createQuantityMutation.mutate,
    addProductPending: createQuantityMutation.isPending,
    updateProductQuantity: updateQuantityMutation,
    updateProductPending: updateQuantityMutation.isPending,
  };
};
