'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import useDebounce from '@/hooks/use-debounce';
import { useGetSouvenirs } from '@/hooks/use-souvenir';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SouvenirTable from './_components/souvenir-table';

export interface SearchFilters {
  souvenirName?: string;
}

const SouvenirsPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [filters, setFilters] = useState<SearchFilters>({
    souvenirName: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (isSearching) {
      setPageNumber(1);
    }
  }, [filters, isSearching]);

  useEffect(() => {
    if (debouncedSearchTerm !== filters.souvenirName) {
      setFilters({ souvenirName: debouncedSearchTerm });
      setIsSearching(debouncedSearchTerm.trim() !== '');
    }
  }, [debouncedSearchTerm, filters.souvenirName]);

  const handleSearch = () => {
    setFilters({ souvenirName: searchTerm });
    setIsSearching(searchTerm.trim() !== '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const buildResultObject = () => {
    if (!isSearching) return {};

    const result: SearchFilters = {};
    if (filters.souvenirName && filters.souvenirName.trim() !== '') {
      result.souvenirName = filters.souvenirName;
    }

    return result;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilters({ souvenirName: '' });
    setIsSearching(false);
  };

  const { souvenirsRes, isLoading, totalPage } = useGetSouvenirs({
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

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý đồ lưu niệm</h2>
        <Link href={PATH.SOUVENIR_CREATE} passHref>
          <Button>
            <Plus className='mr-2' /> Thêm đồ lưu niệm mới
          </Button>
        </Link>
      </div>

      <div className='mb-4 flex gap-2'>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Tìm kiếm đồ lưu niệm'
          className='max-w-sm flex-1'
        />
        {isSearching && (
          <Button variant='outline' onClick={clearSearch}>
            Xóa tìm kiếm
          </Button>
        )}
      </div>

      {isSearching && filters.souvenirName && (
        <div className='mb-4 text-sm'>
          Đang tìm kiếm:{' '}
          <span className='font-semibold'>{filters.souvenirName}</span>
        </div>
      )}

      <SouvenirTable
        souvenirs={souvenirsRes}
        isLoading={isLoading}
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

export default SouvenirsPage;
