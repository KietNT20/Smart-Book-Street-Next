import { personService } from '@/services/personService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSyncPersonData = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => personService.syncData(),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success(`${data.message}`);
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

  return { total: data?.total, isLoading };
};
