'use client';

import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { DatePicker, Image, TimePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useEventForm } from '../_hooks/use-event-form';

// Set locale cho dayjs
dayjs.locale('vi');

const EventForm = () => {
  const {
    form,
    isSubmitting,
    previewBaseImg,
    previewOtherImgs,
    previewVideo,
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
    // Step management
    currentStep,
    handleStreetSelect,
    handleZoneSelect,
    handleBackToStreet,
    handleBackToZone,
    streetsRes,
    zoneByStreetRes,
    isLoadingStreets,
    isLoadingZoneByStreet,
    getCurrentStepData,
  } = useEventForm();

  // Step 1: Street Selection
  const renderStreetSelection = () => (
    <Card className='mx-auto max-w-2xl'>
      <CardHeader className='text-center'>
        <div className='mb-2 flex items-center justify-center gap-2'>
          <MapPin className='h-6 w-6 text-primary' />
          <CardTitle>Chọn Đường Sách</CardTitle>
        </div>
        <CardDescription>
          Vui lòng chọn đường sách để tổ chức sự kiện của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {isLoadingStreets ? (
            <div className='space-y-2'>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className='h-16 w-full' />
              ))}
            </div>
          ) : (
            <div className='grid gap-3'>
              {streetsRes.map((street, index) => (
                <Button
                  key={street?.id || index}
                  variant='outline'
                  className='h-auto justify-start whitespace-normal p-4 text-left hover:bg-primary/5'
                  onClick={() => handleStreetSelect(street?.id)}
                >
                  <div className='min-w-0 flex-1'>
                    <div className='mb-1 text-base font-medium text-primary'>
                      {street?.streetName}
                    </div>
                    <div className='mb-2 break-words text-sm'>
                      {street?.address}
                    </div>
                    {street?.description && (
                      <div className='break-words text-xs leading-relaxed text-muted-foreground'>
                        {street?.description}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Step 2: Zone Selection
  const renderZoneSelection = () => {
    const { selectedStreet } = getCurrentStepData();

    return (
      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleBackToStreet}
              className='h-8 w-8 p-1'
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <div className='flex-1 text-center'>
              <div className='mb-2 flex items-center justify-center gap-2'>
                <Building2 className='h-6 w-6 text-primary' />
                <CardTitle>Chọn Khu Vực</CardTitle>
              </div>
              <CardDescription>
                Chọn khu vực cụ thể tại {selectedStreet?.streetName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {isLoadingZoneByStreet ? (
              <div className='space-y-2'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className='h-16 w-full' />
                ))}
              </div>
            ) : zoneByStreetRes.length === 0 ? (
              <div className='py-8 text-center text-muted-foreground'>
                Không có khu vực nào cho đường phố này
              </div>
            ) : (
              <div className='grid gap-3'>
                {zoneByStreetRes.map((zone, index) => (
                  <Button
                    key={zone?.id || index}
                    variant='outline'
                    className='h-auto justify-start whitespace-normal p-4 text-left hover:bg-primary/5'
                    onClick={() => handleZoneSelect(zone?.id)}
                  >
                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 text-base font-medium text-primary'>
                        {zone?.zoneName}
                      </div>
                      {zone?.description && (
                        <div className='break-words text-sm leading-relaxed'>
                          {zone?.description}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Step 3: Event Details Form
  const renderEventDetailsForm = () => {
    const { selectedStreet, selectedZone } = getCurrentStepData();

    return (
      <div className='mx-auto max-w-4xl'>
        {/* Header with location info */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleBackToZone}
                  className='h-8 w-8 p-1'
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
                <div>
                  <div className='mb-1 flex items-center gap-2'>
                    <Calendar className='h-5 w-5 text-primary' />
                    <h2 className='text-xl font-semibold'>Thông Tin Sự Kiện</h2>
                  </div>
                  <div className='flex gap-2'>
                    <MapPin className='size-4' />
                    <p className='text-sm text-muted-foreground'>
                      {selectedZone?.zoneName} - {selectedStreet?.streetName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            {/* AI Prompt Input */}
            <Card>
              <CardContent className='pt-6'>
                <div className='space-y-3'>
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
                        disabled={
                          isGenerating.eventName || isGenerating.description
                        }
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
              </CardContent>
            </Card>

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
                    Mỗi sự kiện cần có ít nhất một ngày và thời gian kết thúc
                    phải sau thời gian bắt đầu ít nhất 30 phút
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
                {Array.from({
                  length: form.watch('eventDates')?.length || 1,
                }).map((_, index) => (
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
                                className='h-10 w-full px-3 py-2'
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
                                className='h-10 w-full px-3 py-2'
                                placeholder='Chọn giờ bắt đầu'
                                format='HH:mm'
                                value={
                                  field.value
                                    ? dayjs(field.value, 'HH:mm')
                                    : null
                                }
                                onChange={(time) =>
                                  handleStartTimeChange(
                                    index,
                                    time ? time.format('HH:mm') : ''
                                  )
                                }
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
                                className='h-10 w-full px-3 py-2'
                                placeholder='Chọn giờ kết thúc'
                                format='HH:mm'
                                value={
                                  field.value
                                    ? dayjs(field.value, 'HH:mm')
                                    : null
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
                ))}
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
                    <FormLabel className='text-base'>
                      Cho phép quảng cáo
                    </FormLabel>
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
              <Button type='submit' disabled={isSubmitting} className='px-7'>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng ký sự kiện'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  };

  // Main render based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'street':
        return renderStreetSelection();
      case 'zone':
        return renderZoneSelection();
      case 'event-details':
        return renderEventDetailsForm();
      default:
        return renderStreetSelection();
    }
  };

  return (
    <div className='container mx-auto px-4 py-6'>{renderCurrentStep()}</div>
  );
};

export default EventForm;
