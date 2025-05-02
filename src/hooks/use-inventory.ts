import { STORAGE } from '@/constant/storage';
import { inventoryService } from '@/services/inventoryService';
import { InventoryCreate } from '@/types/inventory-types';
import { getLocalStorageItem } from '@/utils/token';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useInventoryByStoreId = (storeId: string) => {
  const storeKey = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventories', storeId],
    queryFn: () => inventoryService.getByStoreId(storeId),
    enabled: !!storeKey,
  });

  return {
    inventoriesByStoreId: data?.results || [],
    totalItems: data?.totalRecords || 0,
    isLoading,
    error,
  };
};

export const useInventoryBooksByStoreId = () => {
  const storeKey = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventories-book', storeKey],
    queryFn: () => inventoryService.getBookNextByStoreId(storeKey),
    enabled: !!storeKey,
  });

  return {
    inventoriesByBook: data?.books || [],
    isLoading,
    error,
  };
};

export const useInventorySouvenirsByStoreId = () => {
  const storeKey = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const { data, isLoading, error } = useQuery({
    queryKey: ['inventories-souvenir', storeKey],
    queryFn: () => inventoryService.getSouvenirNextByStoreId(storeKey),
    enabled: !!storeKey,
  });

  return {
    inventoriesBySouvenir: data?.souvenirs || [],
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
          queryKey: ['inventories-book'],
        });
        queryClient.invalidateQueries({
          queryKey: ['inventories-souvenir'],
        });
      }
    },
    onError: (error: Error) => {
      console.log('Error adding product to inventory:', error.message);
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
          queryKey: ['inventories-book'],
        });
        queryClient.invalidateQueries({
          queryKey: ['inventories-souvenir'],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(`${error.message}`);
      console.log('Error updating quantity product:', error);
    },
  });

  const deleteProductMutation = useMutation({
    mutationKey: ['delete-inventory'],
    mutationFn: ({
      entityId,
      storeId,
    }: {
      entityId: string;
      storeId: string;
    }) => inventoryService.delete(entityId, storeId),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ['inventories-book'],
        });
        queryClient.invalidateQueries({
          queryKey: ['inventories-souvenir'],
        });
        toast.success('Xóa sản phẩm khỏi kho thành công');
      }
    },
    onError: (error) => {
      toast.error(`${error.message}`);
      console.log('Error deleting product to inventory:', error);
    },
  });

  return {
    addProductToStore: createQuantityMutation,
    addProductPending: createQuantityMutation.isPending,
    updateProductQuantity: updateQuantityMutation,
    updateProductPending: updateQuantityMutation.isPending,
    deleteProduct: deleteProductMutation.mutate,
    deleteProductPending: deleteProductMutation.isPending,
  };
};
