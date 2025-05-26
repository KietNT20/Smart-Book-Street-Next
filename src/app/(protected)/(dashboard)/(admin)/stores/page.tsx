'use client';

import { Button } from '@/components/ui/button';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useStores } from '@/hooks/use-store';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import StoreFilter from './_components/store-filter';
import { StoreTable } from './_components/store-table';

export interface SearchFilters {
  storeName?: string;
  address?: string;
  storeTheme?: string;
  type?: string;
  zoneId?: string;
}

export default function StoresPage() {
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [filters, setFilters] = useState<SearchFilters>({
    storeName: '',
    address: '',
    storeTheme: '',
    type: '',
    zoneId: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  // const router = useRouter();
  const searchParams = useSearchParams();

  // Safe parsing of page number
  const pageNumber = useMemo(() => {
    const pageParam = searchParams.get('page');
    const parsed = pageParam ? parseInt(pageParam, 10) : 1;
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams]);

  const buildResultObject = useCallback(() => {
    if (!isSearching) return {};

    const result: SearchFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        result[key as keyof SearchFilters] = value;
      }
    });

    return result;
  }, [filters, isSearching]);

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

  const handleSearch = () => {
    const hasActiveFilter = Object.values(filters).some(
      (value) => value && value.trim() !== ''
    );

    setIsSearching(hasActiveFilter);
  };

  const clearSearch = () => {
    setFilters({
      storeName: '',
      address: '',
      storeTheme: '',
      type: '',
      zoneId: '',
    });
    setIsSearching(false);
  };

  return (
    <div className='container mx-auto'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý cửa hàng</h2>
        <Link href={PATH.STORE_CREATE} passHref>
          <Button>
            <Plus className='mr-2 size-4' /> Thêm cửa hàng mới
          </Button>
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
        pageSize={pageSize}
        setPageSize={setPageSize}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />
    </div>
  );
}
