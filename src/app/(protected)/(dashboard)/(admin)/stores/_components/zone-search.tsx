import LoadingSpinner from '@/components/spin/loading-spinner';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { STORAGE } from '@/constant/storage';
import { useZonesStore } from '@/hooks/use-zone';
import { getLocalStorageItem } from '@/utils/token';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ZoneSearchProps {
  onSelectZone?: (zoneId: string, zoneName: string) => void;
  onClose?: () => void;
}

const ZoneSearch = ({ onSelectZone, onClose }: ZoneSearchProps) => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const streetId = getLocalStorageItem(STORAGE.SELECTED_STREET_KEY);
  const rawPageNumber = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;

  const { zonesStoreRes, isLoadingZonesStore, errorZonesStore, totalPage } =
    useZonesStore({
      result: {
        zoneName: searchValue,
        streetId: streetId || undefined,
      },
      pageNumber: rawPageNumber,
    });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // Calculate the valid page number without side effects
  const pageNumber = useMemo(() => {
    if (!rawPageNumber || rawPageNumber < 1 || isNaN(rawPageNumber)) {
      return 1;
    }
    return Math.min(rawPageNumber, totalPage || 1);
  }, [rawPageNumber, totalPage]);

  useEffect(() => {
    if (totalPage > 0 && rawPageNumber > totalPage) {
      router.replace(
        `${pathname}?${createQueryString('page', totalPage.toString())}`
      );
    }
  }, [rawPageNumber, totalPage, router, pathname, createQueryString]);

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelectZone = (zoneId: string, zoneName: string) => {
    if (onSelectZone) {
      onSelectZone(zoneId, zoneName);
    }

    if (onClose) {
      onClose();
    }
  };

  if (isLoadingZonesStore) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className='mb-4 flex gap-2'>
        <Input
          value={searchValue}
          onChange={_onChange}
          placeholder='Nhập tên khu vực'
          className='flex-1'
        />
      </div>
      {errorZonesStore && (
        <div className='mb-4 text-red-500'>
          Error: {errorZonesStore.message || 'lỗi không xác định'}
        </div>
      )}
      <div className='h-36 overflow-y-auto'>
        {zonesStoreRes.map((zone) => {
          return (
            <div
              key={zone.id}
              onClick={() => handleSelectZone(zone.id, zone.zoneName)}
              className='mb-4 flex cursor-pointer items-center justify-between rounded-lg border bg-card p-4 shadow-sm hover:bg-zinc-100'
            >
              <div className='flex flex-col'>
                <span className='text-lg font-semibold'>{zone.zoneName}</span>
              </div>
            </div>
          );
        })}
      </div>

      {zonesStoreRes?.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={pageNumber === 1}
                href={
                  pathname +
                  '?' +
                  createQueryString('page', pageNumber.toString())
                }
                className={
                  pageNumber === 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
            {/* First page */}
            {pageNumber > 2 && (
              <PaginationItem>
                <PaginationLink
                  href={pathname + '?' + createQueryString('page', '1')}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {/* Ellipsis if needed */}
            {pageNumber > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {/* Previous page if not on first page */}
            {pageNumber > 1 && (
              <PaginationItem>
                <PaginationLink
                  href={
                    pathname +
                    '?' +
                    createQueryString('page', (pageNumber - 1).toString())
                  }
                >
                  {pageNumber - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {/* Current page */}
            <PaginationItem>
              <PaginationLink
                isActive
                href={
                  pathname +
                  '?' +
                  createQueryString('page', pageNumber.toString())
                }
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
            {/* Next page if not on last page */}
            {pageNumber < totalPage && (
              <PaginationItem>
                <PaginationLink
                  href={
                    pathname +
                    '?' +
                    createQueryString('page', (pageNumber + 1).toString())
                  }
                >
                  {pageNumber + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {/* Ellipsis if needed */}
            {pageNumber < totalPage - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {/* Last page */}
            {pageNumber < totalPage - 1 && totalPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href={
                    pathname +
                    '?' +
                    createQueryString('page', totalPage.toString())
                  }
                >
                  {totalPage}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href={
                  pageNumber < totalPage
                    ? pathname +
                      '?' +
                      createQueryString('page', (pageNumber + 1).toString())
                    : '#'
                }
                aria-disabled={pageNumber >= totalPage}
                className={
                  pageNumber >= totalPage
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default ZoneSearch;
