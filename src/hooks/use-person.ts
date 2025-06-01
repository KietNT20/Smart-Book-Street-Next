import { personService } from '@/services/personService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSyncPersonData = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => personService.syncData(),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(`${data.message}`);
        queryClient.invalidateQueries({ queryKey: ['person'] });
        queryClient.invalidateQueries({ queryKey: ['average-minute'] });
        queryClient.invalidateQueries({ queryKey: ['person-total'] });
        queryClient.invalidateQueries({ queryKey: ['person-stats-hours'] });
        queryClient.invalidateQueries({ queryKey: ['daily-range'] });
        queryClient.invalidateQueries({ queryKey: ['population-camera'] });
      }
    },
    onError: (error: Error) => {
      if (error) {
        toast.error(`${error.message}`);
      }
    },
  });

  return { syncData: mutate, isSyncing: isPending };
};

export const useGetPersonTotal = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['person-total'],
    queryFn: () => personService.total(),
  });

  return { totalPerson: data, isLoading };
};

export const useDailyRangeStatistics = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['daily-range', startDate, endDate],
    queryFn: () => personService.dailyRange({ startDate, endDate }),
  });

  return { barData: data?.barData || [], isLoading, error };
};

export const useGetAverageMinute = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['average-minute'],
    queryFn: () => personService.getAverageMinute(),
  });

  return { averageMinute: data, isLoading };
};

export const useGetPersonStatsHours = (date: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['person-stats-hours', date],
    queryFn: () => personService.getStatsHours(date),
  });

  return { statsHours: data, isLoading };
};
