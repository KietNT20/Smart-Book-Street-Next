'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import useDebounce from '@/hooks/use-debounce';
import { useGetStreets } from '@/hooks/use-street';
import { Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import StreetTable from './_components/street-table';

export interface SearchFilters {
  key?: string;
}

export default function StreetsPage() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({
    key: '',
  });

  const { streetsRes, totalPages, isLoadingStreets } = useGetStreets({
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    result: filters,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC);
    } else {
      setSortField(field);
      setSortOrder(Sort.ASC);
    }
  };

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const isSearching = Boolean(filters.key);

  useEffect(() => {
    setFilters({ key: debouncedSearchTerm });
  }, [debouncedSearchTerm]);

  return (
    <div className='container mx-auto'>
      <div className='mb-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2>Quản lý đường sách</h2>
          <Link href={PATH.STREET_CREATE} passHref>
            <Button>
              <Plus /> Thêm đường sách mới
            </Button>
          </Link>
        </div>

        {/* Search Section */}
        <div className='mb-4 flex items-center gap-2'>
          <div className='relative max-w-md flex-1'>
            <Input
              placeholder='Tìm kiếm theo tên đường hoặc địa chỉ...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pr-10'
            />
            {searchTerm && (
              <Button
                variant='ghost'
                size='sm'
                className='absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0'
                onClick={handleClearSearch}
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
          {isSearching && (
            <Button variant='outline' onClick={handleClearSearch}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      <StreetTable
        streets={streetsRes || []}
        isLoading={isLoadingStreets}
        isSearching={isSearching}
        totalPages={totalPages || 1}
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
