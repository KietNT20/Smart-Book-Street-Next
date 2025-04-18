import { eventService } from '@/services/eventService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useGetEventsInMonth = (month: number) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['events-in-month', month],
    queryFn: async () => eventService.getEventsInMonth(month),
    select: (data) => data.results,
  });

  return {
    eventsInMonthData: data,
    eventsInMonthError: error,
    eventsInMonthLoading: isLoading,
  };
};
