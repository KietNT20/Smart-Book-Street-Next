'use client';

import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetEventDateByStaff } from '@/hooks/use-event';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import EventsInDateTable from './_components/event-date-table';

const EventInDatePage = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const { eventsRes, isLoadingEvents, totalPage } = useGetEventDateByStaff({
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    result: {
      date: selectedDate.format('YYYY-MM-DD'),
    },
  });

  useEntityBreadcrumb(
    PATH.EVENT_DATE,
    'Các sự kiện trong ngày',
    '',
    'Các sự kiện trong ngày'
  );

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC);
    } else {
      setSortField(field);
      setSortOrder(Sort.ASC);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setPageNumber(1);
    }
  };

  return (
    <div className='container mx-auto'>
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            Hiển thị sự kiện cho ngày: {selectedDate.format('DD/MM/YYYY')}
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>
              Chọn ngày:
            </label>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              format='DD/MM/YYYY'
              placeholder='Chọn ngày'
              className='h-10 w-full sm:w-auto'
              allowClear={false}
            />
          </div>
        </div>
      </div>

      <EventsInDateTable
        events={eventsRes}
        isLoading={isLoadingEvents}
        totalPages={totalPage || 1}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />
    </div>
  );
};

export default EventInDatePage;
