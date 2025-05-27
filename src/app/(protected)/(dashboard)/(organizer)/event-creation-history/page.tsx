'use client';

import { Sort } from '@/enums/enums';
import { useGetEventCreationHistory } from '@/hooks/use-event';
import { useState } from 'react';
import EventHistoryTable from './_components/event-history-table';

const EventCreationHistoryPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);

  const {
    eventsCreationHistoryRes,
    isLoadingEventsCreationHistory,
    totalPage,
  } = useGetEventCreationHistory({
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC);
    } else {
      setSortField(field);
      setSortOrder(Sort.ASC);
    }
  };

  return (
    <div className='container mx-auto'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Lịch sử tạo sự kiện</h2>
      </div>

      <EventHistoryTable
        events={eventsCreationHistoryRes}
        isLoading={isLoadingEventsCreationHistory}
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

export default EventCreationHistoryPage;
