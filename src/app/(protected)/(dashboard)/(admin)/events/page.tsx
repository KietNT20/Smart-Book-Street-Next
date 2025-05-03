'use client';

import { Button } from '@/components/ui/button';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useEventsPagination } from '@/hooks/use-event';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import EventFilter from './_components/event-filter';
import EventTable from './_components/event-table';

export interface SearchFilters {
  key?: string;
  allowAds?: boolean;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  zoneId?: string;
}

const EventsPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);

  const [filters, setFilters] = useState<SearchFilters>({
    key: '',
    allowAds: false,
    startDate: null,
    endDate: null,
    zoneId: '',
  });

  const [isSearching, setIsSearching] = useState(false);

  const buildResultObject = () => {
    if (!isSearching) return {};

    const result: Record<string, unknown> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() !== '') {
        result[key] = value;
      } else if (typeof value === 'boolean') {
        result[key] = value;
      } else if (value !== null && (key === 'startDate' || key === 'endDate')) {
        result[key] = value;
      }
    });

    return result;
  };

  const { eventsRes, isLoadingEvents, totalPage } = useEventsPagination({
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    result: buildResultObject(),
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC);
    } else {
      setSortField(field);
      setSortOrder(Sort.ASC);
    }
  };

  const handleSearch = () => {
    const hasActiveFilter = Object.values(filters).some((value) => {
      if (typeof value === 'string') return value && value.trim() !== '';
      if (typeof value === 'boolean') return value !== false;
      return value !== null && value !== '';
    });

    setIsSearching(hasActiveFilter);
  };

  const clearSearch = () => {
    setFilters({
      key: '',
      allowAds: true,
      startDate: null,
      endDate: null,
      zoneId: '',
    });
    setIsSearching(false);
  };

  return (
    <div className='container mx-auto'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý sự kiện</h2>
        <Link href={PATH.EVENT_CREATE} passHref>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> Thêm sự kiện mới
          </Button>
        </Link>
      </div>

      <EventFilter
        filters={filters}
        setFilters={setFilters}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
      />

      <EventTable
        events={eventsRes}
        isLoading={isLoadingEvents}
        isSearching={isSearching}
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

export default EventsPage;
