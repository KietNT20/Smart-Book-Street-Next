import { storeService } from '@/services/storeService';
import { StoreParams, StoreSearchCriteria } from '@/types/store-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

  const totalPages = storesRes?.totalPages || 1;

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
    mutationKey: ['create-store'],
    mutationFn: (payload: FormData) => storeService.create(payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['stores'] });
        toast.success('Tạo cửa hàng thành công!');
      }
    },
    onError: (error: Error) => {
      toast.error('Tạo cửa hàng không thành công!');
      console.error('Error creating store:', error);
    },
  });

  const updateStoreMutation = useMutation({
    mutationKey: ['update-store'],
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      storeService.update(id, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['stores'] });
        toast.success('Cập nhật cửa hàng thành công!');
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật cửa hàng không thành công!');
      console.error('Error updating store:', error);
    },
  });

  const deleteStoreMutation = useMutation({
    mutationKey: ['delete-store'],
    mutationFn: (id: string) => storeService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['stores'] });
        toast.success('Xóa cửa hàng thành công!');
      }
    },
    onError: (error: Error) => {
      toast.error('Xóa cửa hàng không thành công!');
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

export const useStoresAll = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeService.getAll(),
  });

  return {
    stores: data || [],
    isLoading,
    error,
  };
};

export const useStoreSearch = (params: StoreSearchCriteria) => {
  const { data, isLoading, isPending, error } = useQuery({
    queryKey: ['stores', params],
    queryFn: () => storeService.search(params),
  });

  return {
    stores: data?.results || [],
    isLoading,
    isPending,
    error,
  };
};

export const useStoreById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stores', id],
    queryFn: () => storeService.getById(id),
  });

  return {
    store: data?.result || null,
    isLoading,
    error,
  };
};
