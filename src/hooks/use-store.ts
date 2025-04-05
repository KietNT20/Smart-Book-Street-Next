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

  return { createStoreMutation };
};
