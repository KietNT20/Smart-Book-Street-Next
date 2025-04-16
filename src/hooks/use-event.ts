import { eventService } from '@/services/eventService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useEventMutaton = () => {
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: (payload: FormData) => eventService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Tạo sự kiện thành công!');
    },
    onError: (error) => {
      console.log('Error registering event:', error);
      toast.error('Tạo sự kiện không thành công!');
    },
  });

  return {
    createEvent: createEventMutation.mutate,
    isEventPending: createEventMutation.isPending,
  };
};
