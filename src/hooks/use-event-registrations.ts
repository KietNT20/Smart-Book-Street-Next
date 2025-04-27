import { eventRegistrationService } from '@/services/eventRegistrationService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetAllEventRegistrations = (eventId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['event-registrations', eventId],
    queryFn: () => eventRegistrationService.getAll(eventId),
  });

  return {
    eventRegistrationsData: data?.results || [],
    isLoading,
    error,
  };
};

export const useCheckAttendend = () => {
  const queryClient = useQueryClient();

  const { mutate: checkedAttendend, isPending: isCheckingPending } =
    useMutation({
      mutationKey: ['check-attendend'],
      mutationFn: (payload: { id: string; isAttended: boolean }) =>
        eventRegistrationService.checkAttendend(payload),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
          toast.success('Cập nhật thành công');
        }
      },
      onError: (error) => {
        console.error('Error checking attendance:', error);
        toast.error('Cập nhật không thành công');
      },
    });

  return { checkedAttendend, isCheckingPending };
};
