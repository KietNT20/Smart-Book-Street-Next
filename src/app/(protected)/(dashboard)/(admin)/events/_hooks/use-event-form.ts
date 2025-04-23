'use client';

import useDebounce from '@/hooks/use-debounce';
import { useEventMutaton } from '@/hooks/use-event';
import { useNonDeletedZones } from '@/hooks/use-zone';
import { eventFormSchema, EventFormValues } from '@/lib/zod';
import { Event } from '@/types/event-types';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type UseEventFormProps = {
  eventEdit?: Event;
};

export const useEventForm = ({ eventEdit }: UseEventFormProps) => {
  // States
  const [previewBaseImg, setPreviewBaseImg] = useState<string | null>(null);
  const [previewOtherImgs, setPreviewOtherImgs] = useState<string[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  // Hooks
  const { nonDeletedZones } = useNonDeletedZones();
  const { createEvent, isEventPending, updateEvent, isEventUpdating } =
    useEventMutaton();
  const isSubmitting = useDebounce(isEventPending || isEventUpdating, 300);

  // Form initialization
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: eventEdit?.eventName || '',
      startDate: eventEdit?.startDate
        ? dayjs(eventEdit.startDate).format('YYYY-MM-DD HH:mm')
        : '',
      endDate: eventEdit?.endDate
        ? dayjs(eventEdit.endDate).format('YYYY-MM-DD HH:mm')
        : '',
      description: eventEdit?.description || '',
      baseImgFile: eventEdit?.baseImgUrl || undefined,
      otherImgFile: [],
      videoFile: eventEdit?.videoLink || undefined,
      isOpen: eventEdit?.isOpen || false,
      allowAds: eventEdit?.allowAds || false,
      zoneId: eventEdit?.zone?.id || '',
    },
  });

  // Form submission handler
  const handleSubmit = (values: EventFormValues) => {
    const formData = new FormData();

    formData.append('EventName', values.eventName);
    if (values.startDate) formData.append('StartDate', values.startDate);
    if (values.endDate) formData.append('EndDate', values.endDate);
    if (values.description) formData.append('Description', values.description);
    formData.append('ZoneId', values.zoneId);
    formData.append('IsOpen', String(values.isOpen || false));
    formData.append('AllowAds', String(values.allowAds || false));

    if (values.baseImgFile && typeof window !== 'undefined') {
      formData.set('BaseImgFile', values.baseImgFile);
    }

    if (
      values.otherImgFile &&
      values.otherImgFile.length > 0 &&
      typeof window !== 'undefined'
    ) {
      values.otherImgFile.forEach((file) => {
        if (file) {
          formData.append(`OtherImgFile`, file);
        }
      });
    }

    if (values.videoFile && typeof window !== 'undefined') {
      formData.append('VideoFile', values.videoFile);
    }

    if (eventEdit?.id) {
      updateEvent({ id: eventEdit.id, formData });
    } else {
      createEvent(formData);
    }
  };

  // Image handlers
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

  // Video handler
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('videoFile', file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  // Remove handlers
  const removeOtherImage = (index: number) => {
    const currentFiles = form.getValues('otherImgFile');
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);
    form.setValue('otherImgFile', updatedFiles);

    const updatedPreviews = [...previewOtherImgs];
    updatedPreviews.splice(index, 1);
    setPreviewOtherImgs(updatedPreviews);
  };

  const removeBaseImage = () => {
    form.setValue('baseImgFile', undefined);
    setPreviewBaseImg(null);
  };

  const removeVideo = () => {
    form.setValue('videoFile', undefined);
    setPreviewVideo(null);
  };

  // Date validation
  const isEndDateValid = (endDate: dayjs.Dayjs) => {
    const startDate = form.getValues('startDate');
    if (!startDate) return true;
    const startDateTime = dayjs(startDate);
    return endDate.isAfter(startDateTime) || endDate.isSame(startDateTime);
  };

  // Date change handlers
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format('YYYY-MM-DD HH:mm') : '';
    form.setValue('startDate', formattedDate);

    // Check and reset endDate if needed
    const endDate = form.getValues('endDate');
    if (endDate && date) {
      const endDateTime = dayjs(endDate);
      if (endDateTime.isBefore(date)) {
        form.setValue('endDate', '');
      }
    }
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    const formattedDate = date ? date.format('YYYY-MM-DD HH:mm') : '';

    if (date && !isEndDateValid(date)) {
      form.setError('endDate', {
        type: 'manual',
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
      return;
    }

    form.setValue('endDate', formattedDate);
  };

  // Clean up
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

  return {
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
  };
};
