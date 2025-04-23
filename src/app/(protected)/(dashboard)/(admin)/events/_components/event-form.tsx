'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import SubmitBtn from '@/components/button/submit-btn';
import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PATH } from '@/enums/path';
import { Event } from '@/types/event-types';
import { DatePicker, Image } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { X } from 'lucide-react';
import { useEventForm } from '../_hooks/use-event-form';

// Set locale cho dayjs
dayjs.locale('vi');

type Props = {
  eventEdit?: Event;
};

const EventForm = ({ eventEdit }: Props) => {
  const {
    form,
    isSubmitting,
    previewBaseImg,
    previewOtherImgs,
    previewVideo,
    nonDeletedZones,
    handleSubmit,
    handleBaseImageChange,
    handleOtherImagesChange,
    handleVideoChange,
    removeOtherImage,
    removeBaseImage,
    removeVideo,
    handleStartDateChange,
    handleEndDateChange,
  } = useEventForm({ eventEdit });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Event name */}
        <FormField
          control={form.control}
          name='eventName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sự kiện</FormLabel>
              <FormControl>
                <Input placeholder='Nhập tên sự kiện' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày giờ bắt đầu</FormLabel>
                <FormControl>
                  <DatePicker
                    className='h-10 w-full px-3 py-2'
                    placeholder='Chọn ngày giờ bắt đầu'
                    format='YYYY-MM-DD HH:mm'
                    showTime={{
                      format: 'HH:mm',
                      defaultValue: dayjs('00:00', 'HH:mm'),
                    }}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={handleStartDateChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày giờ kết thúc</FormLabel>
                <FormControl>
                  <DatePicker
                    className='h-10 w-full px-3 py-2'
                    placeholder='Chọn ngày giờ kết thúc'
                    format='YYYY-MM-DD HH:mm'
                    showTime={{
                      format: 'HH:mm',
                      defaultValue: dayjs('23:59', 'HH:mm'),
                    }}
                    value={field.value ? dayjs(field.value) : null}
                    disabledDate={(current) => {
                      const startDate = form.getValues('startDate');
                      if (!startDate) return false;
                      return (
                        current && current < dayjs(startDate).startOf('day')
                      );
                    }}
                    disabledTime={(current) => {
                      const startDate = form.getValues('startDate');
                      if (!startDate || !current) return {};

                      const startDateTime = dayjs(startDate);
                      if (current.isSame(startDateTime, 'day')) {
                        const startHour = startDateTime.hour();
                        const startMinute = startDateTime.minute();

                        return {
                          disabledHours: () =>
                            Array.from({ length: 24 }, (_, i) => i).filter(
                              (h) => h < startHour
                            ),
                          disabledMinutes: (selectedHour) => {
                            if (selectedHour === startHour) {
                              return Array.from(
                                { length: 60 },
                                (_, i) => i
                              ).filter((m) => m < startMinute);
                            }
                            return [];
                          },
                        };
                      }

                      return {};
                    }}
                    onChange={handleEndDateChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ''}
                  onChange={field.onChange}
                  placeholder='Nhập mô tả sự kiện'
                  isPending={isSubmitting}
                  readOnly={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Zone */}
        <FormField
          control={form.control}
          name='zoneId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khu vực tổ chức</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn khu vực tổ chức' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {nonDeletedZones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.zoneName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main Image */}
        <FormField
          control={form.control}
          name='baseImgFile'
          render={({ field: { ref, onChange } }) => (
            <FormItem>
              <FormLabel>Ảnh chính</FormLabel>
              <FormControl>
                <div className='space-y-4'>
                  <Input
                    id='baseImg'
                    type='file'
                    accept='image/*'
                    disabled={isSubmitting}
                    ref={ref}
                    onChange={(e) => {
                      handleBaseImageChange(e);
                      onChange(e.target.files?.[0] || null);
                    }}
                    className='cursor-pointer'
                  />
                  {previewBaseImg && (
                    <div className='relative w-64 overflow-hidden rounded-md border'>
                      <Image
                        src={previewBaseImg}
                        alt='Base image preview'
                        className='h-full w-full object-cover'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute right-2 top-2 h-8 w-8 rounded-full'
                        onClick={removeBaseImage}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Other Images */}
        <FormField
          control={form.control}
          name='otherImgFile'
          render={({ field: { onChange, ref } }) => (
            <FormItem>
              <FormLabel>Các ảnh khác</FormLabel>
              <FormControl>
                <div className='space-y-4'>
                  <Input
                    id='otherImgs'
                    type='file'
                    accept='image/*'
                    multiple
                    disabled={isSubmitting}
                    ref={ref}
                    onChange={(e) => {
                      handleOtherImagesChange(e);
                      const filesArray = e.target.files
                        ? Array.from(e.target.files)
                        : [];
                      onChange(filesArray.length > 0 ? filesArray : null);
                    }}
                    className='cursor-pointer'
                  />

                  {previewOtherImgs.length > 0 && (
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                      {previewOtherImgs.map((url, index) => (
                        <div
                          key={index}
                          className='relative aspect-square w-full overflow-hidden rounded-md border'
                        >
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className='h-full w-full object-cover'
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute right-2 top-2 h-8 w-8 rounded-full'
                            onClick={() => removeOtherImage(index)}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video */}
        <FormField
          control={form.control}
          name='videoFile'
          render={({ field: { onChange, ref } }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl>
                <div className='space-y-4'>
                  <Input
                    id='video'
                    type='file'
                    accept='video/*'
                    disabled={isSubmitting}
                    ref={ref}
                    onChange={(e) => {
                      handleVideoChange(e);
                      onChange(e.target.files?.[0] || null);
                    }}
                    className='cursor-pointer'
                  />

                  {previewVideo && (
                    <div className='relative w-full max-w-md overflow-hidden rounded-md border'>
                      <video
                        src={previewVideo}
                        controls
                        className='h-auto w-full'
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute right-2 top-2 h-8 w-8 rounded-full'
                        onClick={removeVideo}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Open */}
        <FormField
          control={form.control}
          name='isOpen'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Trạng thái mở</FormLabel>
                <FormDescription>
                  Cho phép người dùng xem sự kiện này
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Allow Ads */}
        <FormField
          control={form.control}
          name='allowAds'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>Cho phép quảng cáo</FormLabel>
                <FormDescription>
                  Cho phép hiển thị quảng cáo trong sự kiện này
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex items-center justify-end gap-4'>
          <CancelButton
            _isPending={isSubmitting}
            routerReplace
            pathUrl={PATH.EVENTS}
          />
          <SubmitBtn ID={eventEdit?.id} _onPending={isSubmitting} />
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
