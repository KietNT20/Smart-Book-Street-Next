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
import useDebounce from '@/hooks/use-debounce';
import { useEventMutaton } from '@/hooks/use-event';
import { useNonDeletedZones } from '@/hooks/use-zone';
import { eventFormSchema, EventFormValues } from '@/lib/zod';
import { Event } from '@/types/event-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  eventEdit?: Event;
};

const EventForm = ({ eventEdit }: Props) => {
  const [previewBaseImg, setPreviewBaseImg] = useState<string | null>(null);
  const [previewOtherImgs, setPreviewOtherImgs] = useState<string[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const { nonDeletedZones } = useNonDeletedZones();
  const { createEvent, isEventPending, updateEvent, isEventUpdating } =
    useEventMutaton();
  const isSubmitting = useDebounce(isEventPending || isEventUpdating, 300);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: eventEdit?.eventName || '',
      startDate: dayjs(eventEdit?.startDate).format('YYYY-MM-DD') || null,
      endDate: dayjs(eventEdit?.endDate).format('YYYY-MM-DD') || null,
      description: eventEdit?.description || '',
      baseImgFile: eventEdit?.baseImgUrl || undefined,
      otherImgFile: [],
      videoFile: eventEdit?.videoLink || undefined,
      isOpen: eventEdit?.isOpen || false,
      allowAds: eventEdit?.allowAds || false,
      zoneId: eventEdit?.zone.id || '',
    },
  });

  const handleSubmit = (values: EventFormValues) => {
    const formData = new FormData();

    formData.append('eventName', values.eventName);
    if (values.startDate) formData.append('startDate', values.startDate);
    if (values.endDate) formData.append('endDate', values.endDate);
    if (values.description) formData.append('description', values.description);
    formData.append('zoneId', values.zoneId);
    formData.append('isOpen', String(values.isOpen || false));
    formData.append('allowAds', String(values.allowAds || false));

    if (values.baseImgFile && values.baseImgFile instanceof File) {
      formData.append('baseImgFile', values.baseImgFile);
    } else if (typeof values.baseImgFile === 'string') {
      formData.append('baseImgFileUrl', values.baseImgFile);
    }

    if (values.otherImgFile && values.otherImgFile.length > 0) {
      values.otherImgFile.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`otherImgFile`, file);
        } else if (typeof file === 'string') {
          formData.append(`otherImgFileUrl[${index}]`, file);
        }
      });
    }

    if (values.videoFile && values.videoFile instanceof File) {
      formData.append('videoFile', values.videoFile);
    } else if (typeof values.videoFile === 'string') {
      formData.append('videoFileUrl', values.videoFile);
    }

    if (eventEdit?.id) {
      updateEvent({ id: eventEdit.id, formData });
    } else {
      createEvent(formData);
    }
  };

  const handleBaseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('baseImgFile', file);
      setPreviewBaseImg(URL.createObjectURL(file));
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const currentFiles = form.getValues('otherImgFile');

      const newFiles = [...currentFiles, ...fileArray];

      form.setValue('otherImgFile', newFiles);

      const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewOtherImgs((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('videoFile', file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  const removeOtherImage = (index: number) => {
    const currentFiles = form.getValues('otherImgFile');
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);
    form.setValue('otherImgFile', updatedFiles);

    const updatedPreviews = [...previewOtherImgs];
    updatedPreviews.splice(index, 1);
    setPreviewOtherImgs(updatedPreviews);
  };

  useEffect(() => {
    return () => {
      if (previewBaseImg && !previewBaseImg.startsWith('http')) {
        URL.revokeObjectURL(previewBaseImg);
      }

      previewOtherImgs.forEach((url) => {
        if (!url.startsWith('http')) {
          URL.revokeObjectURL(url);
        }
      });

      if (previewVideo && !previewVideo.startsWith('http')) {
        URL.revokeObjectURL(previewVideo);
      }
    };
  }, [previewBaseImg, previewOtherImgs, previewVideo]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Tên sự kiện */}
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
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <DatePicker
                    className='h-10 w-full px-3 py-2'
                    placeholder='Chọn ngày bắt đầu'
                    format='YYYY-MM-DD'
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      const formattedDate = date
                        ? date.format('YYYY-MM-DD')
                        : '';
                      field.onChange(formattedDate);
                    }}
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
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <DatePicker
                    className='h-10 w-full px-3 py-2'
                    placeholder='Chọn ngày kết thúc'
                    format='YYYY-MM-DD'
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      const formattedDate = date
                        ? date.format('YYYY-MM-DD')
                        : '';
                      field.onChange(formattedDate);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mô tả */}
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

        {/* Khu vực */}
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

        {/* Ảnh chính */}
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
                    <div className='relative h-64 w-64 overflow-hidden rounded-md border'>
                      <Image
                        src={previewBaseImg}
                        alt='Base image preview'
                        className='h-full w-full object-cover'
                        fill
                      />
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        className='absolute right-2 top-2 h-8 w-8 rounded-full'
                        onClick={() => {
                          form.setValue('baseImgFile', undefined);
                          setPreviewBaseImg(null);
                        }}
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
                      // For multiple files, convert FileList to array
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
                            fill
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
                        onClick={() => {
                          form.setValue('videoFile', undefined);
                          setPreviewVideo(null);
                        }}
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

        {/* Cho phép quảng cáo */}
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
