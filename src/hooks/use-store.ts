import { storeService } from '@/services/storeService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useStoreMutation = () => {
  const queryClient = useQueryClient();

  const createStoreMutation = useMutation({
    mutationFn: (payload: FormData) => storeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error: unknown) => {
      console.error('Error creating store:', error);
    }
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      storeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error: unknown) => {
      console.error('Error updating store:', error);
    }
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (id: string) => storeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error: unknown) => {
      console.error('Error deleting store:', error);
    }
  });

  return {
    // Create store
    createStore: createStoreMutation.mutate,
    isCreatingStore: createStoreMutation.isPending,
    // Update store
    updateStore: updateStoreMutation.mutate,
    isUpdatingStore: updateStoreMutation.isPending,
    // Delete store
    deleteStore: deleteStoreMutation.mutate,
    isDeletingStore: deleteStoreMutation.isPending
  };
};
