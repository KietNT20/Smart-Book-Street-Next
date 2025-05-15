import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// Set locale cho dayjs
dayjs.locale('vi');

export const formatTime = (dateString?: string | Date | null): string => {
  return dayjs(dateString).format('HH:mm');
};

export const formatDateRange = (
  startDate?: Date | string | null,
  endDate?: Date | string | null
): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.isSame(end, 'day')) {
    return start.format('DD/MM/YYYY');
  }

  return `${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`;
};
