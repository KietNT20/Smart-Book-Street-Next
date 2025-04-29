'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DayOfWeek, DayOfWeekLabels } from '@/enums/day-of-week';
import { useStoreScheduleMuatation } from '@/hooks/use-store-schedule';
import { formateDateVi } from '@/lib/utils';
import { StoreSchedules } from '@/types/store-types';
import { Calendar, Clock, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import StoreSchedulesForm from './store-schedule-form';

const getVietnameseDayOfWeek = (dayOfWeek: DayOfWeek) => {
  return DayOfWeekLabels[dayOfWeek];
};

const formatTime = (time: string | null) => {
  if (!time) return '';
  return time.substring(0, 5);
};

type Props = {
  storeSchedules: Array<StoreSchedules & { id: string }>;
};

export default function StoreScheduleDisplay({ storeSchedules }: Props) {
  const [editSchedule, setEditSchedule] = useState<
    (StoreSchedules & { id: string }) | null
  >(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddingNewSchedule, setIsAddingNewSchedule] = useState(false);

  const { deleteStoreSchedule, deleteStoreSchedulePeding } =
    useStoreScheduleMuatation();

  const isDeleting = deleteStoreSchedulePeding;

  const validSchedules = Array.isArray(storeSchedules)
    ? storeSchedules.filter((schedule) => schedule)
    : [];

  const daysOfWeek = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday,
  ];

  const scheduleMap = new Map();
  validSchedules.forEach((schedule) => {
    if (schedule.dayOfWeek !== undefined) {
      const day = Number(schedule.dayOfWeek);
      scheduleMap.set(day, schedule);
    }
  });

  const specialSchedules = validSchedules.filter(
    (schedule) => schedule.specialDate
  );

  const currentDayOfWeek = new Date().getDay();
  const adjustedCurrentDay = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  const handleEdit = (schedule: StoreSchedules & { id: string }) => {
    setIsAddingNewSchedule(false);
    setEditSchedule(schedule);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setIsAddingNewSchedule(true);
    setEditSchedule(null);
    setIsFormModalOpen(true);
  };

  const handleDelete = (scheduleId: string) => {
    setDeleteScheduleId(scheduleId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteScheduleId) {
      deleteStoreSchedule(deleteScheduleId);
      setIsDeleteDialogOpen(false);
    }
  };

  const scheduleToDelete = validSchedules.find(
    (s) => s.id === deleteScheduleId
  );
  const scheduleToDeleteInfo = scheduleToDelete
    ? scheduleToDelete.specialDate
      ? `ngày ${formateDateVi(scheduleToDelete.specialDate)}`
      : `thứ ${getVietnameseDayOfWeek(scheduleToDelete.dayOfWeek)}`
    : '';

  return (
    <div className='space-y-6'>
      {/* Lịch làm việc hàng tuần */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Lịch làm việc hàng tuần</h3>
          <Button onClick={handleAddNew}>
            <Plus className='mr-2 h-4 w-4' />
            Thêm lịch
          </Button>
        </div>
        <div className='overflow-hidden rounded-lg border'>
          {daysOfWeek.map((day) => {
            const schedule = scheduleMap.get(Number(day));
            const isToday = adjustedCurrentDay === day;

            return (
              <div
                key={day}
                className={`flex justify-between border-b p-4 ${
                  isToday ? 'bg-sidebar opacity-90' : ''
                } last:border-b-0`}
              >
                <div className='font-medium'>
                  {getVietnameseDayOfWeek(day)}
                  {isToday && (
                    <span className='ml-2 text-xs text-blue-500'>
                      (Hôm nay)
                    </span>
                  )}
                </div>
                <div className='flex items-center gap-3'>
                  {schedule ? (
                    <>
                      <div className='flex items-center gap-4 text-sm'>
                        {schedule.isClosed ? (
                          <Badge variant='destructive'>Đóng cửa</Badge>
                        ) : (
                          <Badge variant={'matcha'}>Đang mở</Badge>
                        )}
                        <div className='flex items-center text-sm'>
                          <Clock className='mr-1 h-4 w-4 text-zinc-500' />
                          {formatTime(schedule.openTime)} -{' '}
                          {formatTime(schedule.closeTime)}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleEdit(schedule)}
                          className='h-8 w-8 text-zinc-500 hover:text-zinc-900'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(schedule.id)}
                          className='h-8 w-8 text-zinc-500 hover:text-red-600'
                          disabled={isDeleting}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <span className='text-sm text-zinc-500'>
                      Chưa thiết lập
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lịch đặc biệt */}
      {specialSchedules.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-lg font-medium'>Lịch làm việc đặc biệt</h3>
          <div className='overflow-hidden rounded-lg border'>
            {specialSchedules.map((schedule, index) => (
              <div
                key={index}
                className='flex justify-between border-b p-4 last:border-b-0'
              >
                <div className='flex items-center'>
                  <Calendar className='mr-2 h-4 w-4 text-zinc-500' />
                  <span className='font-medium'>
                    {schedule.specialDate
                      ? formateDateVi(schedule.specialDate)
                      : ''}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-4 text-sm'>
                    {schedule.isClosed ? (
                      <Badge variant='destructive'>Đóng cửa</Badge>
                    ) : (
                      <Badge>Đang mở</Badge>
                    )}
                    <div className='flex items-center text-sm'>
                      <Clock className='mr-1 h-4 w-4 text-zinc-500' />
                      {formatTime(schedule.openTime)} -{' '}
                      {formatTime(schedule.closeTime)}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(schedule)}
                      className='h-8 w-8 text-zinc-500 hover:text-zinc-900'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(schedule.id)}
                      className='h-8 w-8 text-zinc-500 hover:text-red-600'
                      disabled={isDeleting}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hiển thị khi không có dữ liệu */}
      {validSchedules.length === 0 && (
        <div className='rounded-lg bg-gray-50 py-8 text-center'>
          <p className='text-zinc-500'>
            Chưa có thông tin giờ làm việc nào được thiết lập.
          </p>
          <Button onClick={handleAddNew} variant='outline' className='mt-4'>
            <Plus className='mr-2 h-4 w-4' />
            Thêm lịch làm việc mới
          </Button>
        </div>
      )}

      {/* Modal cho cả thêm mới và chỉnh sửa lịch */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingNewSchedule
                ? 'Thêm lịch làm việc mới'
                : 'Chỉnh sửa lịch làm việc'}
            </DialogTitle>
            {!isAddingNewSchedule && editSchedule && (
              <DialogDescription>
                {editSchedule.specialDate
                  ? `Ngày đặc biệt: ${formateDateVi(editSchedule.specialDate)}`
                  : `Thứ: ${getVietnameseDayOfWeek(editSchedule.dayOfWeek)}`}
              </DialogDescription>
            )}
          </DialogHeader>
          <StoreSchedulesForm
            storeSchedule={
              isAddingNewSchedule || editSchedule === null
                ? undefined
                : editSchedule
            }
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lịch làm việc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch làm việc cho {scheduleToDeleteInfo}{' '}
              không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
