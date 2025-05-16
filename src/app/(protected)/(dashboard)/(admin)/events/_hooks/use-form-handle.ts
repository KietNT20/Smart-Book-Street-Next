import { useEventMutaton } from '@/hooks/use-event';
import { eventFormSchema, EventFormValues } from '@/lib/zod';
import { Event } from '@/types/event-types';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

export const useFormHandle = (eventEdit?: Event) => {
  // Form initialization
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: eventEdit?.eventName || '',
      description: eventEdit?.description || '',
      baseImgFile: eventEdit?.baseImgUrl || undefined,
      otherImgFile: [],
      videoFile: eventEdit?.videoLink || undefined,
      isOpen: eventEdit?.isOpen || false,
      allowAds: eventEdit?.allowAds || false,
      zoneId: eventEdit?.zone?.id || '',
      eventDates: eventEdit?.startDate
        ? [dayjs(eventEdit.startDate).format('YYYY-MM-DD')]
        : [''],
      startTimes: eventEdit?.startDate
        ? [dayjs(eventEdit.startDate).format('HH:mm')]
        : [''],
      endTimes: eventEdit?.endDate
        ? [dayjs(eventEdit.endDate).format('HH:mm')]
        : [''],
    },
  });

  // Form submission
  const { createEvent, isEventPending, updateEvent, isEventUpdating } =
    useEventMutaton();
  const isSubmitting = isEventPending || isEventUpdating;

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
    formData.append('IsOpen', String(values.isOpen || false));
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

    if (eventEdit?.id) {
      updateEvent({ id: eventEdit.id, formData });
    } else {
      createEvent(formData);
    }
  };

  return {
    form,
    handleSubmit,
    isSubmitting,
  };
};
