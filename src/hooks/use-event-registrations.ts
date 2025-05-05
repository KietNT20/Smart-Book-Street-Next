import { eventRegistrationService } from '@/services/eventRegistrationService';
import { CheckedAttendendPayload } from '@/types/event-registrations-types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetAllEventRegistrations = (eventId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['event-registrations', eventId],
    queryFn: () => eventRegistrationService.getAll(eventId),
    placeholderData: keepPreviousData,
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
      mutationFn: (payload: CheckedAttendendPayload) =>
        eventRegistrationService.checkAttendend(payload),
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
          queryClient.invalidateQueries({
            queryKey: ['event-registrations-statistic'],
          });
          toast.success('Điểm danh thành công');
        }
      },
      onError: (error) => {
        console.error('Error checking attendance:', error);
        toast.error(`${error}`);
      },
    });

  return { checkedAttendend, isCheckingPending };
};

export const useGetStatisticEventRegistrations = (eventId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['event-registrations-statistic', eventId],
    queryFn: () => eventRegistrationService.statistic(eventId),
  });

  return {
    statisticData: data,
    isLoading,
    error,
  };
};
