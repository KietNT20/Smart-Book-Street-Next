import { zoneService } from '@/services/zoneService';
import { ZoneParams } from '@/types/zone-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  const totalPages = data?.totalPages || 0;

  if (pageNumber < totalPages) {
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
  };
};
