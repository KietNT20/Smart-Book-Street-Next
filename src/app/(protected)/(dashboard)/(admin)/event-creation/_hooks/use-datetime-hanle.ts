import { EventFormValues } from '@/lib/zod';
import dayjs from 'dayjs';
import { UseFormReturn } from 'react-hook-form';

export const useDateTimeHandle = (form: UseFormReturn<EventFormValues>) => {
  // Handle date and time for event schedules
  const addDateTimeSet = () => {
    const currentEventDates = [...(form.getValues('eventDates') || [])];
    const currentStartTimes = [...(form.getValues('startTimes') || [])];
    const currentEndTimes = [...(form.getValues('endTimes') || [])];

    form.setValue('eventDates', [...currentEventDates, '']);
    form.setValue('startTimes', [...currentStartTimes, '']);
    form.setValue('endTimes', [...currentEndTimes, '']);
  };

  const removeDateTimeSet = (index: number) => {
    const currentEventDates = [...form.getValues('eventDates')];
    const currentStartTimes = [...form.getValues('startTimes')];
    const currentEndTimes = [...form.getValues('endTimes')];

    currentEventDates.splice(index, 1);
    currentStartTimes.splice(index, 1);
    currentEndTimes.splice(index, 1);

    form.setValue('eventDates', currentEventDates, { shouldValidate: true });
    form.setValue('startTimes', currentStartTimes, { shouldValidate: true });
    form.setValue('endTimes', currentEndTimes, { shouldValidate: true });
  };

  const validateTimeRange = (index: number) => {
    const eventDates = form.getValues('eventDates');
    const startTimes = form.getValues('startTimes');
    const endTimes = form.getValues('endTimes');

    if (
      eventDates &&
      eventDates[index] &&
      startTimes &&
      startTimes[index] &&
      endTimes &&
      endTimes[index]
    ) {
      const startDateTime = dayjs(`${eventDates[index]} ${startTimes[index]}`);
      const endDateTime = dayjs(`${eventDates[index]} ${endTimes[index]}`);

      const minutesDiff = endDateTime.diff(startDateTime, 'minute');

      if (endDateTime.isBefore(startDateTime)) {
        form.setError(`endTimes.${index}`, {
          type: 'manual',
          message: 'Thời gian kết thúc không thể trước thời gian bắt đầu',
        });
      } else if (minutesDiff < 30) {
        form.setError(`endTimes.${index}`, {
          type: 'manual',
          message:
            'Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 30 phút',
        });
      } else {
        form.clearErrors(`endTimes.${index}`);
      }
    }
  };

  const validateChronologicalOrder = () => {
    const eventDates = form.getValues('eventDates');
    const startTimes = form.getValues('startTimes');

    if (eventDates?.length > 1) {
      // Check if have at least two dates to compare
      for (let i = 1; i < eventDates.length; i++) {
        const prevDate = eventDates[i - 1];
        const prevTime = startTimes[i - 1];
        const currentDate = eventDates[i];

        if (prevDate && prevTime && currentDate) {
          const prevDateTime = dayjs(`${prevDate} ${prevTime}`);
          const currentDateTime = dayjs(`${currentDate} 00:00`); // Get the start of the day

          if (!currentDateTime.isAfter(prevDateTime)) {
            form.setError(`eventDates.${i}`, {
              type: 'manual',
              message: 'Ngày này phải sau thời gian kết thúc của ngày trước',
            });
          } else {
            form.clearErrors(`eventDates.${i}`);
          }
        }
      }
    }
  };

  const handleEventDateChange = (index: number, date: string) => {
    const currentEventDates = [...(form.getValues('eventDates') || [])];
    currentEventDates[index] = date;
    form.setValue('eventDates', currentEventDates, { shouldValidate: true });

    validateTimeRange(index);
    validateChronologicalOrder();
  };

  const handleStartTimeChange = (index: number, time: string) => {
    const currentStartTimes = [...(form.getValues('startTimes') || [])];
    currentStartTimes[index] = time;
    form.setValue('startTimes', currentStartTimes, { shouldValidate: true });

    validateTimeRange(index);
    validateChronologicalOrder();
  };

  const handleEndTimeChange = (index: number, time: string) => {
    const currentEndTimes = [...(form.getValues('endTimes') || [])];
    currentEndTimes[index] = time;
    form.setValue('endTimes', currentEndTimes, { shouldValidate: true });

    validateTimeRange(index);
  };

  // Hàm kiểm tra xem ngày có được phép chọn không
  const isDateDisabled = (date: dayjs.Dayjs, index: number) => {
    // Nếu là phần tử đầu tiên, chỉ disallow ngày trong quá khứ
    if (index === 0) {
      return date.isBefore(dayjs().startOf('day'));
    }

    // Nếu là phần tử sau, phải sau ngày trước đó
    const prevDates = form.getValues('eventDates');
    const prevTimes = form.getValues('startTimes');

    if (
      prevDates &&
      prevDates[index - 1] &&
      prevTimes &&
      prevTimes[index - 1]
    ) {
      const prevDateTime = dayjs(
        `${prevDates[index - 1]} ${prevTimes[index - 1] || '00:00'}`
      );
      return date.isBefore(prevDateTime);
    }

    return false;
  };

  const getDisabledHours = (index: number, isEndTime: boolean = false) => {
    if (!isEndTime) return () => [];

    const startTimes = form.getValues('startTimes');
    if (startTimes && startTimes[index]) {
      const [startHour, startMinute] = startTimes[index].split(':').map(Number);

      if (startMinute > 30) {
        // Nếu phút bắt đầu > 30, chỉ disable các giờ trước giờ bắt đầu
        return () => Array.from({ length: startHour }, (_, i) => i);
      } else {
        // Nếu phút bắt đầu ≤ 30, disable cả giờ bắt đầu
        return () => Array.from({ length: startHour }, (_, i) => i);
      }
    }

    return () => [];
  };

  const getDisabledMinutes = (
    index: number,
    hour: number,
    isEndTime: boolean = false
  ) => {
    if (!isEndTime) return () => [];

    const startTimes = form.getValues('startTimes');
    if (startTimes && startTimes[index]) {
      const [startHour, startMinute] = startTimes[index].split(':').map(Number);

      if (hour === startHour) {
        // Nếu cùng giờ, disable tất cả phút trước startMinute + 30
        return () => Array.from({ length: startMinute + 30 }, (_, i) => i);
      } else if (hour === startHour + 1 && startMinute > 30) {
        // Nếu giờ tiếp theo và phút bắt đầu > 30, disable các phút đầu
        // Ví dụ: Nếu bắt đầu 14:45, khi chọn 15:xx chỉ có thể chọn từ 15:15 trở đi
        const disabledMinutes = startMinute - 30;
        return () => Array.from({ length: disabledMinutes }, (_, i) => i);
      }
    }

    return () => [];
  };

  return {
    addDateTimeSet,
    removeDateTimeSet,
    handleEventDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    isDateDisabled,
    getDisabledHours,
    getDisabledMinutes,
  };
};
