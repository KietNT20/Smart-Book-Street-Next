import { useEventMutaton } from '@/hooks/use-event';
import { useNonDeletedZones } from '@/hooks/use-zone';
import { eventFormSchema, EventFormValues } from '@/lib/zod';
import { Event } from '@/types/event-types';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOpenAISuggestions } from './use-openai-suggestions';

type UseEventFormProps = {
  eventEdit?: Event;
};

export const useEventForm = ({ eventEdit }: UseEventFormProps) => {
  const [previewBaseImg, setPreviewBaseImg] = useState<string | null>(null);
  const [previewOtherImgs, setPreviewOtherImgs] = useState<string[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const [baseImgFile, setBaseImgFile] = useState<File | null>(null);
  const [otherImgFiles, setOtherImgFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Thêm state cho gợi ý
  const [promptInput, setPromptInput] = useState<string>('');

  const baseImgInputRef = useRef<HTMLInputElement | null>(null);
  const otherImgsInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Hooks
  const { nonDeletedZones } = useNonDeletedZones();
  const { createEvent, isEventPending, updateEvent, isEventUpdating } =
    useEventMutaton();
  const isSubmitting = isEventPending || isEventUpdating;

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

  // Xử lý khi nhận được gợi ý từ OpenAI
  const handleSuggestionReceived = (
    type: 'eventName' | 'description',
    suggestion: string
  ) => {
    form.setValue(type, suggestion);
  };

  const { isGenerating, generateSuggestion } = useOpenAISuggestions({
    onSuggestionReceived: handleSuggestionReceived,
  });

  const generateEventNameSuggestion = () => {
    const context = promptInput || 'Hãy tạo tên cho một sự kiện';
    generateSuggestion('eventName', context);
  };

  const generateDescriptionSuggestion = () => {
    const eventName = form.getValues('eventName');
    const startDate = form.getValues('startDate');
    const endDate = form.getValues('endDate');
    const zoneId = form.getValues('zoneId');

    const zoneName =
      nonDeletedZones?.find((zone) => zone.id === zoneId)?.zoneName || '';

    const context = promptInput || eventName || 'Tạo mô tả cho sự kiện';

    generateSuggestion('description', context, {
      eventName,
      startDate,
      endDate,
      zoneName,
    });
  };

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

    if (
      values.baseImgFile &&
      typeof values.baseImgFile === 'object' &&
      typeof window !== 'undefined'
    ) {
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

    if (
      values.videoFile &&
      typeof values.videoFile === 'object' &&
      typeof window !== 'undefined'
    ) {
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
      setBaseImgFile(file); // Save file
      form.setValue('baseImgFile', file);
      setPreviewBaseImg(URL.createObjectURL(file));
    }
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Update state files
      const currentStateFiles = [...otherImgFiles];
      const newStateFiles = [...currentStateFiles, ...fileArray];
      setOtherImgFiles(newStateFiles);

      // Update form
      const currentFormFiles = form.getValues('otherImgFile') || [];
      const newFormFiles = [...currentFormFiles, ...fileArray];
      form.setValue('otherImgFile', newFormFiles);

      // Update previews
      const newPreviewUrls = fileArray?.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewOtherImgs((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Video handler
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file); // Lưu trữ file
      form.setValue('videoFile', file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  // Remove handlers
  const removeOtherImage = (index: number) => {
    // Update state files
    const updatedStateFiles = [...otherImgFiles];
    updatedStateFiles.splice(index, 1);
    setOtherImgFiles(updatedStateFiles);

    const updatedFormFiles = [...(form.getValues('otherImgFile') || [])];
    updatedFormFiles.splice(index, 1);
    form.setValue('otherImgFile', updatedFormFiles);

    const updatedPreviews = [...previewOtherImgs];
    updatedPreviews.splice(index, 1);
    setPreviewOtherImgs(updatedPreviews);
  };

  const removeBaseImage = () => {
    // Update state
    setBaseImgFile(null);
    // Update form
    form.setValue('baseImgFile', undefined);
    // Remove preview
    setPreviewBaseImg(null);
  };

  const removeVideo = () => {
    // Update state
    setVideoFile(null);
    // Update form
    form.setValue('videoFile', undefined);
    // Remove preview
    setPreviewVideo(null);
  };

  const handleRemoveBaseImage = () => {
    removeBaseImage();
    if (baseImgInputRef.current) {
      baseImgInputRef.current.value = '';
    }
  };

  const handleRemoveOtherImage = (index: number) => {
    removeOtherImage(index);
    if (previewOtherImgs.length <= 1 && otherImgsInputRef.current) {
      otherImgsInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = () => {
    removeVideo();
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
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

  // Handler cho input prompt
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptInput(e.target.value);
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
    baseImgFile,
    otherImgFiles,
    videoFile,
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
  };
};
