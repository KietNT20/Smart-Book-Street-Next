import { PATH } from '@/enums/path';
import { eventService } from '@/services/eventService';
import { EventParams } from '@/types/event-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useEventMutaton = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createEventMutation = useMutation({
    mutationKey: ['create-event'],
    mutationFn: (payload: FormData) => eventService.create(payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        toast.success('Tạo sự kiện thành công!');
        router.replace(PATH.EVENTS);
      }
    },
    onError: (error) => {
      console.log('Error creating event:', error);
      toast.error('Tạo sự kiện không thành công!');
    },
  });

  const updatEventMutation = useMutation({
    mutationKey: ['update-event'],
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      eventService.update(id, formData),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        toast.success('Cập nhật sự kiện thành công!');
        router.replace(PATH.EVENTS);
      }
    },
    onError: (error) => {
      console.log('Error registering event:', error);
      toast.error('Cập nhật sự kiện không thành công!');
    },
  });

  const deleteEventMutation = useMutation({
    mutationKey: ['delete-event'],
    mutationFn: (id: string) => eventService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        toast.success('Xóa sự kiện thành công!');
      }
    },
    onError: (error) => {
      console.log('Error deleting event:', error);
      toast.error('Xóa sự kiện không thành công!');
    },
  });

  return {
    createEvent: createEventMutation.mutate,
    isEventPending: createEventMutation.isPending,
    updateEvent: updatEventMutation.mutate,
    isEventUpdating: updatEventMutation.isPending,
    deleteEvent: deleteEventMutation.mutate,
    isEventDeleting: deleteEventMutation.isPending,
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

export const useEventsPagination = ({
  result,
  sortField,
  sortOrder,
  pageSize,
  pageNumber,
}: EventParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', result, sortField, sortOrder, pageSize, pageNumber],
    queryFn: () =>
      eventService.getEvents({
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
  });

  // Prefetching data
  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'events',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        eventService.getEvents({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber + 1,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'events',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        eventService.getEvents({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    eventsRes: data?.results || [],
    isLoadingEvents: isLoading,
    errorEvents: error,
    totalPage,
  };
};

export const useGetEventById = (id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => eventService.getEventById(id),
    enabled: !!id,
  });

  return {
    eventData: data?.result || null,
    eventError: error,
    eventLoading: isLoading,
  };
};
