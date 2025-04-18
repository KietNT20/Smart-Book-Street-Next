import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { zoneService } from '@/services/zoneService';
import {
  ZoneCreate,
  ZoneParams,
  ZoneSearchStoreParams,
} from '@/types/zone-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useNonDeletedZones = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['zones'],
    queryFn: () => zoneService.getNonDeleted(),
  });

  return {
    nonDeletedZones: data?.results || [],
    isLoadingNonDeletedZones: isLoading,
    errorNonDeletedZones: error,
  };
};

export const useZoneDetail = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['zones', id],
    queryFn: () => zoneService.getById(id),
    enabled: !!id,
  });

  return {
    zoneDetail: data?.result || null,
    isLoadingZoneDetail: isLoading,
    errorZoneDetail: error,
  };
};

export const useZones = ({
  result,
  sortField,
  sortOrder,
  pageSize,
  pageNumber,
}: ZoneParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['zones', result, sortField, sortOrder, pageSize, pageNumber],
    queryFn: () =>
      zoneService.getAll({
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
  });

  // Prefetching data
  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'zones',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        zoneService.getAll({
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
        'zones',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        zoneService.getAll({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    zonesRes: data?.results || [],
    isLoadingZones: isLoading,
    errorZones: error,
    totalPage,
  };
};

export const useZoneMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createZoneMutation = useMutation({
    mutationKey: ['create-zone'],
    mutationFn: (payload: ZoneCreate) => zoneService.create(payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['zones'] });
        toast.success('Tạo khu vực thành công!');
        router.replace(PATH.ZONES);
      }
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi tạo khu vực, vui lòng thử lại!`);
      console.error('Error creating zone:', error);
    },
  });

  const updateZoneMutation = useMutation({
    mutationKey: ['update-zone'],
    mutationFn: ({ id, payload }: { id: string; payload: ZoneCreate }) =>
      zoneService.update(id, payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['zones'] });
        toast.success('Cập nhật khu vực thành công!');
        router.replace(PATH.ZONES);
      }
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi cập nhật khu vực, vui lòng thử lại!`);
      console.error('Error updating zone:', error);
    },
  });

  const deleteZoneMutation = useMutation({
    mutationKey: ['delete-zone'],
    mutationFn: (id: string) => zoneService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['zones'] });
        toast.success('Xóa khu vực thành công!');
      }
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khi xóa khu vực, vui lòng thử lại!`);
      console.error('Error deleting zone:', error);
    },
  });

  return {
    // Create Zone
    createZone: createZoneMutation.mutate,
    isCreatingZone: createZoneMutation.isPending,
    errorCreateZone: createZoneMutation.error,
    // Update Zone
    updateZone: updateZoneMutation.mutate,
    isUpdatingZone: updateZoneMutation.isPending,
    errorUpdateZone: updateZoneMutation.error,
    // Delete Zone
    deleteZone: deleteZoneMutation.mutate,
    isDeletingZone: deleteZoneMutation.isPending,
    errorDeleteZone: deleteZoneMutation.error,
  };
};

export const useZonesStore = ({
  result,
  pageNumber,
}: ZoneSearchStoreParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['zones-store', result, pageNumber],
    queryFn: () =>
      zoneService.getAll({
        result,
        sortField: '',
        sortOrder: Sort.DEFAULT,
        pageSize: 5,
        pageNumber,
      }),
  });

  // Prefetching data
  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: ['zones-store', result, pageNumber + 1],
      queryFn: () =>
        zoneService.getAll({
          result,
          sortField: '',
          sortOrder: Sort.DEFAULT,
          pageSize: 5,
          pageNumber: pageNumber + 1,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: ['zones-store', result, pageNumber - 1],
      queryFn: () =>
        zoneService.getAll({
          result,
          sortField: '',
          sortOrder: Sort.DEFAULT,
          pageSize: 5,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    zonesStoreRes: data?.results || [],
    isLoadingZonesStore: isLoading,
    errorZonesStore: error,
    totalPage,
  };
};
