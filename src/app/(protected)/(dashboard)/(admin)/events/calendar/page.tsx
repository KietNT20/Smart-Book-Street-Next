'use client';

import { AlertDestructive } from '@/components/alert/alert-destructive';
import SpinLoading from '@/components/spin/spin-loading';
import { useGetEventsInMonth } from '@/hooks/use-event';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useState } from 'react';

dayjs.locale('vi'); // Set locale to Vietnamese

const EventCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const { eventsInMonthData, eventsInMonthError, eventsInMonthLoading } =
    useGetEventsInMonth(selectedMonth);

  const handlePanelChange = (
    value: Dayjs,
    mode: CalendarProps<Dayjs>['mode']
  ) => {
    if (mode === 'month') {
      const newMonth = value.month() + 1; // dayjs months are 0-indexed
      const newYear = value.year();

      if (newMonth !== selectedMonth || newYear !== selectedYear) {
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
      }
    }
  };

  // Xử lý khi chọn một ngày/tháng cụ thể
  const handleSelect = (value: Dayjs) => {
    const newMonth = value.month() + 1;
    const newYear = value.year();

    if (newMonth !== selectedMonth || newYear !== selectedYear) {
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    }
  };

  if (eventsInMonthLoading)
    return (
      <div>
        <SpinLoading />
      </div>
    );

  if (eventsInMonthError)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <AlertDestructive
          title='Lỗi xảy ra khi tải sự kiện!'
          description='Vui lòng thử lại sau.'
        />
      </div>
    );

  // Function to get events for a specific date
  const getListData = (value: Dayjs) => {
    // Format the date to match eventDate format
    const dateStr = value.format('YYYY-MM-DD');

    // Filter events that match this date
    const events =
      eventsInMonthData?.filter((event) => {
        const eventDateStr = dayjs(event.eventDate).format('YYYY-MM-DD');
        return eventDateStr === dateStr;
      }) || [];

    // Convert to the format expected by the Badge component
    if (events.length > 0) {
      return [
        {
          type: 'success',
          content: `${events.length} sự kiện`,
        },
      ];
    }

    return [];
  };

  const monthCellRender = (value: Dayjs) => {
    // Count events in this month
    const month = value.month();
    const year = value.year();

    // Try to parse eventDate strings safely
    const eventsInThisMonth =
      eventsInMonthData?.filter((event) => {
        try {
          const eventDate = dayjs(event.eventDate);
          return eventDate.month() === month && eventDate.year() === year;
        } catch {
          return false;
        }
      }) || [];

    const count = eventsInThisMonth.length;

    return count ? (
      <div className='notes-month'>
        <section>{count}</section>
        <span>Sự kiện</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);

    return (
      <ul className='events'>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status={item.type as BadgeProps['status']}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div className='container mx-auto rounded-lg border bg-background p-4 shadow-md'>
      <Calendar
        cellRender={cellRender}
        onPanelChange={handlePanelChange}
        onSelect={handleSelect}
        defaultValue={dayjs(`${selectedYear}-${selectedMonth}-01`)}
      />
    </div>
  );
};

export default EventCalendar;
