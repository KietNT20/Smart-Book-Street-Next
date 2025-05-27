'use client';

import { Button } from '@/components/ui/button';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { usePublishers } from '@/hooks/use-publisher';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import PublisherFilter from './_components/publisher-filter';
import PublisherTable from './_components/publisher-table';

export interface SearchFilters {
  publisherName?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

const PublishersPage = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [filters, setFilters] = useState<SearchFilters>({
    publisherName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const buildResultObject = () => {
    if (!isSearching) return {};

    const result: SearchFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        result[key as keyof SearchFilters] = value;
      }
    });

    return result;
  };

  const { publishers, isLoadingPublishers, totalPage } = usePublishers({
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
    const hasActiveFilter = Object.values(filters).some(
      (value) => value && value.trim() !== ''
    );

    setIsSearching(hasActiveFilter);
  };

  const clearSearch = () => {
    setFilters({
      publisherName: '',
      address: '',
      phone: '',
      email: '',
      website: '',
    });
    setIsSearching(false);
  };

  return (
    <div className='container mx-auto'>
      <div className='mb-4 flex items-center justify-between'>
        <h2>Quản lý nhà xuất bản</h2>
        <Link href={PATH.PUBLISHER_CREATE} passHref>
          <Button>
            <Plus /> Thêm nhà xuất bản mới
          </Button>
        </Link>
      </div>

      <PublisherFilter
        filters={filters}
        setFilters={setFilters}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
      />

      <PublisherTable
        publishers={publishers}
        isLoading={isLoadingPublishers}
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

export default PublishersPage;
