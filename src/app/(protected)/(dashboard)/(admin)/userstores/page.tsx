'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import useDebounce from '@/hooks/use-debounce';
import { useStores } from '@/hooks/use-store';
import { Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import StoreRentTable from './_components/store-rent-table';

export interface SearchFilters {
  address?: string;
}

const UserStoresPage = () => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [filters, setFilters] = useState<SearchFilters>({
    address: '',
  });

  const searchParams = useSearchParams();

  const debouncedAddress = useDebounce(filters.address, 500);
  const isSearching = (debouncedAddress || '').trim() !== '';

  // Safe parsing of page number
  const pageNumber = useMemo(() => {
    const pageParam = searchParams.get('page');
    const parsed = pageParam ? parseInt(pageParam, 10) : 1;
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams]);

  const buildResultObject = useCallback(() => {
    if (!isSearching) return {};

    const result: SearchFilters = {};
    if (debouncedAddress && debouncedAddress.trim() !== '') {
      result.address = debouncedAddress.trim();
    }

    return result;
  }, [debouncedAddress, isSearching]);

  const { stores, isLoading, isPending, totalPages } = useStores({
    pageNumber: pageNumber,
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

  const clearSearch = () => {
    setFilters({
      address: '',
    });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  return (
    <div className='container mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Thông tin cửa hàng</h2>
        <Link href={PATH.STORE_CREATE} passHref>
          <Button>
            <Plus className='mr-2 size-4' /> Thêm cửa hàng mới
          </Button>
        </Link>
      </div>

      {/* Search Section */}
      <Card className='shadow-sm'>
        <CardContent className='pt-6'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground' />
              <Input
                placeholder='Tìm kiếm theo địa chỉ cửa hàng...'
                value={filters.address || ''}
                onChange={(e) => handleFilterChange('address', e.target.value)}
                onKeyDown={handleKeyDown}
                className='pl-10'
              />
            </div>
            {isSearching && (
              <Button variant='outline' onClick={clearSearch}>
                <X className='mr-2 size-4' />
                Xóa
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {isSearching && (
        <div className='text-sm text-muted-foreground'>
          {isLoading
            ? 'Đang tìm kiếm...'
            : `Tìm thấy ${stores?.length || 0} kết quả`}
        </div>
      )}

      {/* Table */}
      <StoreRentTable
        stores={stores}
        isLoading={isLoading || isPending}
        isSearching={isSearching}
        totalPages={totalPages || 1}
        pageSize={pageSize}
        setPageSize={setPageSize}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />
    </div>
  );
};

export default UserStoresPage;
