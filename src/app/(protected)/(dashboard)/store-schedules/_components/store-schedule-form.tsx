'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STORAGE } from '@/constant/storage';
import { DayOfWeek, DayOfWeekLabels } from '@/enums/day-of-week';
import { useStoreScheduleMuatation } from '@/hooks/use-store-schedule';
import { StoreSchedules } from '@/types/store-types';
import { getLocalStorageItem } from '@/utils/token';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const storeScheduleSchema = z.object({
  storeId: z.string().min(1, { message: 'Store ID là bắt buộc' }),
  dayOfWeek: z.nativeEnum(DayOfWeek, {
    required_error: 'Vui lòng chọn ngày trong tuần',
  }),
  openTime: z.string().min(1, { message: 'Thời gian mở cửa là bắt buộc' }),
  closeTime: z.string().min(1, { message: 'Thời gian đóng cửa là bắt buộc' }),
  isClosed: z.boolean().default(false),
  specialDate: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof storeScheduleSchema>;

type Props = {
  storeSchedule?: StoreSchedules & { id: string };
};

export default function StoreSchedulesForm({ storeSchedule }: Props) {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
  const {
    createStoreSchedule,
    createStoreSchedulePeding,
    updateStoreSchedule,
    updateStoreSchedulePeding,
  } = useStoreScheduleMuatation();
  const isWorking = createStoreSchedulePeding || updateStoreSchedulePeding;

  // Xử lý specialDate để tránh lỗi Invalid Date
  const getSpecialDateValue = () => {
    if (!storeSchedule?.specialDate) return null;

    const dateObj = dayjs(storeSchedule.specialDate);
    return dateObj.isValid() ? dateObj.format('YYYY-MM-DD') : null;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(storeScheduleSchema),
    defaultValues: {
      storeId: storeSchedule?.storeId || storeId,
      dayOfWeek: storeSchedule?.dayOfWeek || DayOfWeek.Monday,
      openTime: storeSchedule?.openTime || '09:00',
      closeTime: storeSchedule?.closeTime || '18:00',
      isClosed: storeSchedule?.isClosed || false,
      specialDate: getSpecialDateValue(),
    },
  });

  useEffect(() => {
    form.setValue('storeId', storeId);
  }, [storeId, form]);

  const onSubmit = (values: FormValues) => {
    if (storeSchedule?.id) {
      updateStoreSchedule({ id: storeSchedule.id, payload: values });
    } else {
      createStoreSchedule(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='dayOfWeek'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày trong tuần</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value.toString()}
                disabled={isWorking}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn ngày trong tuần' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(DayOfWeekLabels)
                    .filter((key) => !isNaN(Number(key)))
                    .map((key) => {
                      const numKey = Number(key);
                      return (
                        <SelectItem key={numKey} value={numKey.toString()}>
                          {DayOfWeekLabels[numKey as DayOfWeek]}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='isClosed'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isWorking}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Đóng cửa</FormLabel>
                <FormDescription>
                  Chọn tùy chọn này nếu cửa hàng đóng cửa vào ngày này
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='openTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian mở cửa</FormLabel>
              <FormControl>
                <TimePicker
                  className='h-10 w-full px-3 py-2'
                  format='HH:mm'
                  value={field.value ? dayjs(field.value, 'HH:mm') : null}
                  onChange={(time) => {
                    field.onChange(time ? time.format('HH:mm') : '');
                  }}
                  disabled={isWorking}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='closeTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian đóng cửa</FormLabel>
              <FormControl>
                <TimePicker
                  className='h-10 w-full px-3 py-2'
                  format='HH:mm'
                  value={field.value ? dayjs(field.value, 'HH:mm') : null}
                  onChange={(time) => {
                    field.onChange(time ? time.format('HH:mm') : '');
                  }}
                  disabled={isWorking}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='specialDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày đặc biệt (nếu có)</FormLabel>
              <FormControl>
                <DatePicker
                  className='h-10 w-full px-3 py-2'
                  format='DD/MM/YYYY'
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date ? date.format('YYYY-MM-DD') : null);
                  }}
                  disabled={isWorking}
                  allowClear={true}
                />
              </FormControl>
              <FormDescription>
                Chọn nếu lịch này áp dụng cho một ngày cụ thể
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='md:flex md:justify-end'>
          <Button
            type='submit'
            disabled={isWorking}
            className='w-full sm:w-auto'
          >
            {isWorking ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xử lý...
              </>
            ) : storeSchedule ? (
              'Lưu thay đổi'
            ) : (
              'Thêm lịch làm việc'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
