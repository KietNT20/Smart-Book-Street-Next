import { streetService } from '@/services/streetService';
import { StreetParams, StreetsResponse } from '@/types/street-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetStreetsAll = () => {
  const { data, isLoading, error } = useQuery<StreetsResponse>({
    queryKey: ['streets'],
    queryFn: () => streetService.getAll(),
  });

  return {
    streetsRes: data?.results || [],
    isLoadingStreets: isLoading,
    errorStreets: error,
  };
};

export const useGetStreets = ({
  sortField,
  sortOrder,
  pageNumber,
  pageSize,
  result,
}: StreetParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<StreetsResponse>({
    queryKey: [
      'streets',
      { sortField, sortOrder, pageNumber, pageSize, result },
    ],
    queryFn: () =>
      streetService.getPagination({
        sortField,
        sortOrder,
        pageNumber,
        pageSize,
        result,
      }),
  });

  const totalPages = data?.totalPages || 1;

  if (pageNumber < totalPages) {
    queryClient.prefetchQuery({
      queryKey: [
        'streets',
        { sortField, sortOrder, pageNumber: pageNumber + 1, pageSize, result },
      ],
      queryFn: () =>
        streetService.getPagination({
          sortField,
          sortOrder,
          pageNumber: pageNumber + 1,
          pageSize,
          result,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'streets',
        { sortField, sortOrder, pageNumber: pageNumber - 1, pageSize, result },
      ],
      queryFn: () =>
        streetService.getPagination({
          sortField,
          sortOrder,
          pageNumber: pageNumber - 1,
          pageSize,
          result,
        }),
    });
  }

  return {
    streetsRes: data?.results || [],
    isLoadingStreets: isLoading,
    errorStreets: error,
    totalPages,
  };
};

export const useGetStreetById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['street', id],
    queryFn: () => streetService.getById(id),
  });

  return {
    streetRes: data?.result || {},
    isLoadingStreet: isLoading,
    errorStreet: error,
  };
};

export const useStreetMutation = () => {
  const queryClient = useQueryClient();
  const createStreetMutation = useMutation({
    mutationKey: ['create-street'],
    mutationFn: (data: FormData) => streetService.create(data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['streets'] });
        toast.success('Tạo đường sáng thành công');
      }
    },
    onError: (error) => {
      console.log('create street error', error);
      toast.error('Tạo đường sáng thất bại');
    },
  });

  const updateStreetMutation = useMutation({
    mutationKey: ['update-street'],
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      streetService.update(id, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['streets'] });
        toast.success('Cập nhật đường sáng thành công');
      }
    },
    onError: (error) => {
      console.log('update street error', error);
      toast.error('Cập nhật đường sáng thất bại');
    },
  });

  const deleteStreetMutation = useMutation({
    mutationKey: ['delete-street'],
    mutationFn: (id: string) => streetService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['streets'] });
        toast.success('Xóa đường sáng thành công');
      }
    },
    onError: (error) => {
      console.log('delete street error', error);
      toast.error('Xóa đường sáng thất bại');
    },
  });

  return {
    // create street mutation
    createStreet: createStreetMutation.mutate,
    createStreetLoading: createStreetMutation.isPending,
    createStreetError: createStreetMutation.error,
    // update street mutation
    updateStreet: updateStreetMutation.mutate,
    updateStreetLoading: updateStreetMutation.isPending,
    updateStreetError: updateStreetMutation.error,
    // delete street mutation
    deleteStreet: deleteStreetMutation.mutate,
    deleteStreetLoading: deleteStreetMutation.isPending,
    deleteStreetError: deleteStreetMutation.error,
  };
};
