'use client';

import { Button } from '@/components/ui/button';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useStores } from '@/hooks/use-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { StoreFilter } from './_components/store-filter';
import { StoreTable } from './_components/store-table';

interface SearchFilters {
  bookStoreName?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingTime?: string | null;
  closingTime?: string | null;
}

export default function StoresPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('storeName');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.ASC);
  const [filters, setFilters] = useState<SearchFilters>({
    bookStoreName: '',
    address: '',
    phone: '',
    email: '',
    openingTime: null,
    closingTime: null
  });
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

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

  const { stores, isLoading, isPending, totalPages } = useStores({
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    result: buildResultObject()
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
      bookStoreName: '',
      address: '',
      phone: '',
      email: '',
      openingTime: null,
      closingTime: null
    });
    setIsSearching(false);
  };

  const handleEditStore = (storeId: string) => {
    router.push(`${PATH.STORES}/${storeId}/edit`);
  };

  const handleViewStore = (storeId: string) => {
    router.push(`${PATH.STORES}/${storeId}`);
  };

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý cửa hàng</h2>
        <Link href={PATH.STORE_CREATE} passHref>
          <Button>Thêm cửa hàng mới</Button>
        </Link>
      </div>

      <StoreFilter
        filters={filters}
        setFilters={setFilters}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
      />

      <StoreTable
        stores={stores}
        isLoading={isLoading || isPending}
        isSearching={isSearching}
        totalPages={totalPages || 1}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onViewStore={handleViewStore}
        onEditStore={handleEditStore}
      />
    </div>
  );
}
