'use client';

import { Button } from '@/components/ui/button';
import { STORAGE } from '@/constant/storage';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useZones } from '@/hooks/use-zone';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ZoneFilter from './_components/zone-filter';
import ZoneTable from './_components/zone-table';

export interface SearchFilters {
  zoneName?: string;
}

const ZonesPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [filters, setFilters] = useState<SearchFilters>({
    zoneName: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();
  const streetId = localStorage.getItem(STORAGE.SELECTED_STREET_KEY);

  const { zonesRes, isLoadingZones, totalPage } = useZones({
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    result: {
      zoneName: filters.zoneName,
      streetId: streetId,
    },
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

  const handleEditZone = (zoneId: string) => {
    router.push(`${PATH.ZONES}/${zoneId}`);
  };

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý khu vực</h2>
        <Link href={PATH.ZONE_CREATE} passHref>
          <Button>
            <Plus /> Thêm khu vực mới
          </Button>
        </Link>
      </div>

      <ZoneFilter
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />

      <ZoneTable
        zones={zonesRes}
        isLoading={isLoadingZones}
        isSearching={isSearching}
        totalPages={totalPage || 1}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onEditZone={handleEditZone}
      />
    </div>
  );
};

export default ZonesPage;
