import { storeService } from '@/services/storeService';
import { StoreParams } from '@/types/store-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useStores = ({
  result,
  sortField,
  sortOrder,
  pageSize,
  pageNumber,
}: StoreParams) => {
  const queryClient = useQueryClient();
  const {
    data: storesRes,
    isLoading,
    isPending,
    error,
  } = useQuery({
    queryKey: ['stores', result, sortField, sortOrder, pageSize, pageNumber],
    queryFn: () =>
      storeService.searchPagination({
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
  });

  const totalPages = storesRes?.totalPages || 0;

  // Prefetch the next page of stores
  if (pageNumber < totalPages) {
    queryClient.prefetchQuery({
      queryKey: [
        'stores',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        storeService.searchPagination({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber + 1,
        }),
    });
  }
  // Prefetch the previous page of stores
  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'stores',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        storeService.searchPagination({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    stores: storesRes?.results || [],
    isLoading,
    isPending,
    error,
    totalPages,
  };
};

export const useStoreMutation = () => {
  const queryClient = useQueryClient();

  const createStoreMutation = useMutation({
    mutationFn: (payload: FormData) => storeService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error: unknown) => {
      console.error('Error creating store:', error);
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      storeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error: unknown) => {
      console.error('Error updating store:', error);
    },
  });

  const deleteStoreMutation = useMutation({
    mutationFn: (id: string) => storeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
    onError: (error: unknown) => {
      console.error('Error deleting store:', error);
    },
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
    isDeletingStore: deleteStoreMutation.isPending,
  };
};
