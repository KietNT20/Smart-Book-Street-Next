import { streetService } from '@/services/streetService';
import { StreetsResponse } from '@/types/street-types';
import { useQuery } from '@tanstack/react-query';

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
