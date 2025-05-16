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
import { DatePicker, Image, TimePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Loader2, Plus, Sparkles, Trash2, X } from 'lucide-react';
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
    zonesByStreetRes,
    handleSubmit,
    handleBaseImageChange,
    handleOtherImagesChange,
    handleVideoChange,
    baseImgInputRef,
    otherImgsInputRef,
    videoInputRef,
    handleRemoveBaseImage,
    handleRemoveOtherImage,
    handleRemoveVideo,
    // OpenAI Helpers
    promptInput,
    handlePromptChange,
    generateEventNameSuggestion,
    generateDescriptionSuggestion,
    isGenerating,
    // Handle Date time Events
    addDateTimeSet,
    removeDateTimeSet,
    handleEventDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    isDateDisabled,
    getDisabledHours,
    getDisabledMinutes,
  } = useEventForm({ eventEdit });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* AI Prompt Input */}
        <div className='space-y-3 rounded-lg border bg-muted/30 p-4'>
          <h3 className='flex items-center gap-2 font-medium'>
            <Sparkles className='h-4 w-4' />
            Gợi ý AI
          </h3>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <Input
                placeholder='Nhập gợi ý cho AI (ví dụ: triển lãm sách, hội thảo văn học...)'
                value={promptInput}
                onChange={handlePromptChange}
                className='flex-1'
                disabled={isGenerating.eventName || isGenerating.description}
              />
            </div>
            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='flex-1'
                disabled={isGenerating.eventName}
                onClick={generateEventNameSuggestion}
              >
                {isGenerating.eventName ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang tạo tên...
                  </>
                ) : (
                  <>
                    <Sparkles className='mr-2 h-4 w-4' />
                    Gợi ý tên sự kiện
                  </>
                )}
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='flex-1'
                disabled={isGenerating.description}
                onClick={generateDescriptionSuggestion}
              >
                {isGenerating.description ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Đang tạo mô tả...
                  </>
                ) : (
                  <>
                    <Sparkles className='mr-2 h-4 w-4' />
                    Gợi ý mô tả
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

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

        {/* Event Dates, Start Times, End Times */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <FormLabel className='text-base'>Thời gian sự kiện</FormLabel>
              <FormDescription className='text-sm'>
                Mỗi sự kiện cần có ít nhất một ngày và thời gian kết thúc phải
                sau thời gian bắt đầu ít nhất 30 phút
              </FormDescription>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={addDateTimeSet}
              className='flex items-center gap-1'
            >
              <Plus className='h-4 w-4' /> Thêm ngày
            </Button>
          </div>

          <div className='space-y-3'>
            {Array.from({ length: form.watch('eventDates')?.length || 1 }).map(
              (_, index) => (
                <div
                  key={`datetime-set-${index}`}
                  className='flex flex-col space-y-2 rounded-md border p-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0'
                >
                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name={`eventDates.${index}`}
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel className='mb-1 text-sm'>
                            Ngày {index + 1}
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              className='w-full'
                              placeholder='Chọn ngày'
                              format='YYYY-MM-DD'
                              value={field.value ? dayjs(field.value) : null}
                              disabledDate={(date) =>
                                isDateDisabled(date, index)
                              }
                              onChange={(date) =>
                                handleEventDateChange(
                                  index,
                                  date ? date.format('YYYY-MM-DD') : ''
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name={`startTimes.${index}`}
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel className='mb-1 text-sm'>
                            Giờ bắt đầu
                          </FormLabel>
                          <FormControl>
                            <TimePicker
                              className='w-full'
                              placeholder='Chọn giờ bắt đầu'
                              format='HH:mm'
                              value={
                                field.value ? dayjs(field.value, 'HH:mm') : null
                              }
                              onChange={(time) =>
                                handleStartTimeChange(
                                  index,
                                  time ? time.format('HH:mm') : ''
                                )
                              }
                              // Nếu là ngày hôm nay thì disable giờ trong quá khứ
                              disabledTime={() => {
                                const now = dayjs();
                                const selectedDate =
                                  form.getValues('eventDates')?.[index];

                                if (
                                  selectedDate &&
                                  dayjs(selectedDate).isSame(now, 'day')
                                ) {
                                  const currentHour = now.hour();
                                  const currentMinute = now.minute();

                                  return {
                                    disabledHours: () =>
                                      Array.from(
                                        { length: currentHour },
                                        (_, i) => i
                                      ),
                                    disabledMinutes: (hour) => {
                                      if (hour === currentHour) {
                                        return Array.from(
                                          { length: currentMinute },
                                          (_, i) => i
                                        );
                                      }
                                      return [];
                                    },
                                  };
                                }

                                return {};
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='flex-1'>
                    <FormField
                      control={form.control}
                      name={`endTimes.${index}`}
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel className='mb-1 text-sm'>
                            Giờ kết thúc
                          </FormLabel>
                          <FormControl>
                            <TimePicker
                              className='w-full'
                              placeholder='Chọn giờ kết thúc'
                              format='HH:mm'
                              value={
                                field.value ? dayjs(field.value, 'HH:mm') : null
                              }
                              onChange={(time) =>
                                handleEndTimeChange(
                                  index,
                                  time ? time.format('HH:mm') : ''
                                )
                              }
                              disabledTime={() => {
                                return {
                                  disabledHours: () =>
                                    getDisabledHours(index, true)(),
                                  disabledMinutes: (hour) =>
                                    getDisabledMinutes(index, hour, true)(),
                                };
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('eventDates')?.length > 1 && (
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='h-10 w-10 shrink-0 self-end'
                      onClick={() => removeDateTimeSet(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              )
            )}
          </div>

          {form.formState.errors.eventDates && (
            <p className='text-sm font-medium text-destructive'>
              {form.formState.errors.eventDates.message}
            </p>
          )}
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
                  isPending={isSubmitting || isGenerating.description}
                  readOnly={isSubmitting || isGenerating.description}
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
                  {zonesByStreetRes?.map((zone) => (
                    <SelectItem key={zone?.id} value={zone?.id}>
                      {zone?.zoneName}
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
                    ref={(e) => {
                      ref(e);
                      if (e) {
                        baseImgInputRef.current = e;
                      }
                    }}
                    onChange={(e) => {
                      handleBaseImageChange(e);
                      onChange(e.target.files?.[0] || null);
                    }}
                    className='cursor-pointer'
                  />
                  {previewBaseImg && (
                    <div className='relative flex h-72 items-center justify-center overflow-hidden rounded-md border'>
                      <Image
                        src={previewBaseImg}
                        alt='Base image preview'
                        className='object-cover'
                        height={275}
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute right-2 top-2 h-8 w-8 rounded-full'
                        onClick={handleRemoveBaseImage}
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
                    ref={(e) => {
                      ref(e);
                      if (e) {
                        otherImgsInputRef.current = e;
                      }
                    }}
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
                      {previewOtherImgs?.map((url, index) => (
                        <div
                          key={index}
                          className='relative flex aspect-video w-full items-center overflow-hidden rounded-md border'
                        >
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                            }}
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            className='absolute right-2 top-2 h-8 w-8 rounded-full'
                            onClick={() => handleRemoveOtherImage(index)}
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
                    ref={(e) => {
                      ref(e);
                      if (e) {
                        videoInputRef.current = e;
                      }
                    }}
                    onChange={(e) => {
                      handleVideoChange(e);
                      onChange(e.target.files?.[0] || null);
                    }}
                    className='cursor-pointer'
                  />

                  {previewVideo && (
                    <div className='relative aspect-video w-full overflow-hidden rounded-md border'>
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
                        onClick={handleRemoveVideo}
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
                  Cho phép người dùng đăng ký sự kiện này
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
