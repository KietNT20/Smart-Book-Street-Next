import { inventoryService } from '@/services/inventoryService';
import { InventoryCreate } from '@/types/inventory-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useInventoryMutation = () => {
  const queryClient = useQueryClient();

  const updateQuantityMutation = useMutation({
    mutationFn: ({ entityId, storeId, quantity, isInStock }: InventoryCreate) =>
      inventoryService.create({ entityId, storeId, quantity, isInStock }),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ['inventories', data.storeId],
        });
      }
    },
  });

  return { updateQuantityMutation };
};
