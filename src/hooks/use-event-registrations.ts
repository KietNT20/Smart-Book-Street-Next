import { eventRegistrationService } from '@/services/eventRegistrationService';
import {
  CheckedAttendendPayload,
  EventRegistrationStatisticParams,
} from '@/types/event-registrations-types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
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

export const useGetStatisticEventRegistrations = (
  eventId: string,
  params?: EventRegistrationStatisticParams
) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['event-registrations-statistic', eventId, params],
    queryFn: () => eventRegistrationService.statistic(eventId, params),
    enabled: !!eventId,
    retry: 2,
  });

  useEffect(() => {
    if (!params) {
      queryClient.prefetchQuery({
        queryKey: ['event-registrations-statistic', eventId, undefined],
        queryFn: () => eventRegistrationService.statistic(eventId),
      });
    }

    if (params?.isAttended === undefined) {
      queryClient.prefetchQuery({
        queryKey: [
          'event-registrations-statistic',
          eventId,
          { ...params, isAttended: true },
        ],
        queryFn: () =>
          eventRegistrationService.statistic(eventId, {
            ...params,
            isAttended: true,
          }),
      });

      queryClient.prefetchQuery({
        queryKey: [
          'event-registrations-statistic',
          eventId,
          { ...params, isAttended: false },
        ],
        queryFn: () =>
          eventRegistrationService.statistic(eventId, {
            ...params,
            isAttended: false,
          }),
      });
    }
  }, [queryClient, eventId, params]);

  return {
    statisticData: data,
    isLoading,
    error,
  };
};
