import { PATH } from '@/enums/path';
import { useEventMutaton } from '@/hooks/use-event';
import { eventFormSchema, EventFormValues } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export const useFormHandle = () => {
  const router = useRouter();
  // Form initialization
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: '',
      description: '',
      baseImgFile: undefined,
      otherImgFile: [],
      videoFile: undefined,
      isOpen: false,
      allowAds: false,
      zoneId: '',
      eventDates: [''],
      startTimes: [''],
      endTimes: [''],
    },
  });

  // Form submission
  const { createEvent, isEventPending } = useEventMutaton();
  const isSubmitting = isEventPending;

  const handleSubmit = (values: EventFormValues) => {
    const formData = new FormData();

    formData.append('EventName', values.eventName);

    values.eventDates.forEach((date, index) => {
      formData.append(`EventDates[${index}]`, date);
    });

    values.startTimes.forEach((time, index) => {
      formData.append(`StartTimes[${index}]`, time);
    });

    values.endTimes.forEach((time, index) => {
      formData.append(`EndTimes[${index}]`, time);
    });

    if (values.description) formData.append('Description', values.description);
    formData.append('ZoneId', values.zoneId);
    formData.append('IsOpen', String(false));
    formData.append('AllowAds', String(values.allowAds || false));

    if (values.baseImgFile instanceof File && typeof window !== 'undefined') {
      formData.set('BaseImgFile', values.baseImgFile);
    }

    if (
      values.otherImgFile &&
      values.otherImgFile.length > 0 &&
      typeof window !== 'undefined'
    ) {
      values.otherImgFile.forEach((file) => {
        if (file instanceof File) {
          formData.append(`OtherImgFile`, file);
        }
      });
    }

    if (
      values.videoFile &&
      values.videoFile instanceof File &&
      typeof window !== 'undefined'
    ) {
      formData.append('VideoFile', values.videoFile);
    }

    createEvent(formData, {
      onSuccess: (data) => {
        if (data) {
          router.replace(PATH.EVENT_CREATION);
          form.reset();
        }
      },
    });
  };

  return {
    form,
    handleSubmit,
    isSubmitting,
  };
};
