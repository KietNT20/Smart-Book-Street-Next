import { PATH } from '@/enums/path';
import { eventService } from '@/services/eventService';
import {
  EventCreateReqParams,
  EventParams,
  EventStaffParams,
} from '@/types/event-types';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
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
    placeholderData: keepPreviousData,
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

export const useEventStaticsInMonth = (month: number) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['event-statistics', month],
    queryFn: async () => eventService.getStatisticInMonth(month),
  });

  return {
    eventStaticsDataMonth: data,
    eventStaticsError: error,
    eventStaticsLoading: isLoading,
  };
};

export const useGetEventsInDate = (date: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['events-in-date', date],
    queryFn: async () => eventService.getEventInDate(date),
    enabled: !!date,
  });

  return {
    eventsInDateData: data?.results || [],
    eventsInDateError: error,
    eventsInDateLoading: isLoading,
  };
};

export const useGetEventDateByStaff = ({
  result,
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
}: EventStaffParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', result, sortField, sortOrder, pageSize, pageNumber],
    queryFn: () =>
      eventService.getEventsInDateForCheckin({
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
    placeholderData: keepPreviousData,
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
        eventService.getEventsInDateForCheckin({
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
        eventService.getEventsInDateForCheckin({
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

export const useGetEventCreateRequest = ({
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
}: EventCreateReqParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: [
      'events-create-request',
      sortField,
      sortOrder,
      pageSize,
      pageNumber,
    ],
    queryFn: () =>
      eventService.getAllEventCreateRequests({
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
    placeholderData: keepPreviousData,
  });

  // Prefetching data
  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'events-create-request',
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        eventService.getAllEventCreateRequests({
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
        'events-create-request',
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        eventService.getAllEventCreateRequests({
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    eventsCreateRequestRes: data?.results || [],
    isLoadingEventsCreateRequest: isLoading,
    errorEventsCreateRequest: error,
    totalPage,
  };
};

export const useApproveEventCreateRequest = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['approve-event-create-request'],
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      eventService.eventProcessRequest(id, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['events-create-request'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
    },
    onError: (error) => {
      console.log('Error approving event create request:', error);
      toast.error(`${error}`);
    },
  });

  return {
    approveEventCreateRequest: mutation.mutate,
    isApprovingEventCreateRequest: mutation.isPending,
    errorApprovingEventCreateRequest: mutation.error,
  };
};

export const useGetEventCreationHistory = ({
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
}: EventCreateReqParams) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: [
      'events-creation-history',
      sortField,
      sortOrder,
      pageSize,
      pageNumber,
    ],
    queryFn: () =>
      eventService.getEventCreationsHistory({
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
    placeholderData: keepPreviousData,
  });

  // Prefetching data
  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'events-creation-history',
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        eventService.getEventCreationsHistory({
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
        'events-creation-history',
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        eventService.getEventCreationsHistory({
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    eventsCreationHistoryRes: data?.results || [],
    isLoadingEventsCreationHistory: isLoading,
    errorEventsCreationHistory: error,
    totalPage,
  };
};

export const useGetEventCreationHistoryDetail = (id: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['events-creation-history-detail', id],
    queryFn: () => eventService.getRequestHistoryDetail(id),
  });

  return {
    eventCreationHistoryDetailData: data?.results || [],
    eventCreationHistoryDetailError: error,
    eventCreationHistoryDetailLoading: isLoading,
  };
};

export const useProcessEventCreateRequest = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['process-event-create-request'],
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      eventService.eventProcessRequest(id, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['events-create-request'] });
      }
    },
    onError: (error) => {
      console.log('Error processing event create request:', error);
      toast.error('Xử lý yêu cầu tạo sự kiện không thành công!');
    },
  });

  return {
    processEventCreateRequest: mutation.mutate,
    isProcessingEventCreateRequest: mutation.isPending,
    errorProcessingEventCreateRequest: mutation.error,
  };
};

export const useEventOpenState = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['event-open-state'],
    mutationFn: (id: string) => eventService.eventOpenState(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['events-create-request'] });
      }
    },
    onError: (error) => {
      console.log('Error getting event open state:', error);
      toast.error('Cập nhật trạng thái mở sự kiện không thành công!');
    },
  });

  return {
    getEventOpenState: mutation.mutate,
    isGettingEventOpenState: mutation.isPending,
    errorGettingEventOpenState: mutation.error,
  };
};
