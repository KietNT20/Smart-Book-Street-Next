'use client';

import { Sort } from '@/enums/enums';
import { useGetEventCreateRequest } from '@/hooks/use-event';
import { useState } from 'react';
import EventReqTable from './_components/event-req-table';

export default function EventCreateRequestPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);

  const { eventsCreateRequestRes, isLoadingEventsCreateRequest, totalPage } =
    useGetEventCreateRequest({
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
        <h2 className='text-2xl font-bold'>Các yêu cầu tạo sự kiện</h2>
      </div>

      <EventReqTable
        events={eventsCreateRequestRes}
        isLoading={isLoadingEventsCreateRequest}
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
}
