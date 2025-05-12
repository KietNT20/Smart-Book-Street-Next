import { storeScheduleService } from '@/services/storeScheduleService';
import { StoreSchedulesPayload } from '@/types/store-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useStoreScheduleMuatation = () => {
  const queryClient = useQueryClient();
  const createStoreScheduleMutation = useMutation({
    mutationFn: (payload: StoreSchedulesPayload) =>
      storeScheduleService.create(payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['store-schedules'] });
        queryClient.invalidateQueries({
          queryKey: ['store-schedules', data.storeId],
        });
        toast.success('Tạo lịch làm việc thành công!');
      }
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra!');
      console.error('Error creating store schedule:', error);
    },
  });
  const updateStoreScheduleMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: StoreSchedulesPayload;
    }) => storeScheduleService.update(id, payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['store-schedules'] });
        queryClient.invalidateQueries({
          queryKey: ['store-schedules', data.storeId],
        });
        toast.success('Cập nhật lịch làm việc thành công!');
      }
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra!');
      console.error('Error updating store schedule:', error);
    },
  });
  const deleteStoreScheduleMutation = useMutation({
    mutationFn: (id: string) => storeScheduleService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['store-schedules'] });
        queryClient.invalidateQueries({
          queryKey: ['store-schedules', data.storeId],
        });
        toast.success('Xóa lịch làm việc thành công!');
      }
    },
    onError: (error) => {
      toast.error('Có lỗi xảy ra!');
      console.error('Error deleting store schedule:', error);
    },
  });
  return {
    createStoreSchedule: createStoreScheduleMutation.mutate,
    createStoreSchedulePeding: createStoreScheduleMutation.isPending,
    errorCreateStoreSchedule: createStoreScheduleMutation.error,
    updateStoreSchedule: updateStoreScheduleMutation.mutate,
    updateStoreSchedulePeding: updateStoreScheduleMutation.isPending,
    errorUpdateStoreSchedule: updateStoreScheduleMutation.error,
    deleteStoreSchedule: deleteStoreScheduleMutation.mutate,
    deleteStoreSchedulePeding: deleteStoreScheduleMutation.isPending,
    errorDeleteStoreSchedule: deleteStoreScheduleMutation.error,
  };
};

export const useStoreScheduleByStoreId = (storeId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['store-schedules', storeId],
    queryFn: () => storeScheduleService.getAllByStoreId(storeId),
    enabled: !!storeId,
  });

  return { storeSchedulesRes: data || [], isLoading };
};
