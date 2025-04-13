import { personService } from '@/services/personService';
import { useMutation } from '@tanstack/react-query';
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
