import { TableSkeleton } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { StoreData } from '@/types/store-types';
import { ArrowUpDown, Eye, SortAsc, SortDesc } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

interface StoreRentTableProps {
  stores: StoreData[];
  isLoading: boolean;
  isSearching: boolean;
  totalPages: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortField: string;
  sortOrder: Sort;
  handleSort: (field: string) => void;
}

const StoreRentTable = ({
  stores,
  isLoading,
  isSearching,
  totalPages,
  pageSize,
  setPageSize,
  sortField,
  sortOrder,
  handleSort,
}: StoreRentTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showEmptyState = !isLoading && (!stores || stores.length === 0);
  const rawPageNumber = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : 1;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Use useEffect to handle redirection when page number exceeds total
  useEffect(() => {
    if (totalPages > 0 && rawPageNumber > totalPages) {
      router.replace(
        `${pathname}?${createQueryString('page', totalPages.toString())}`
      );
    }
  }, [rawPageNumber, totalPages, router, pathname, createQueryString]);

  // Calculate the valid page number without side effects
  const pageNumber = useMemo(() => {
    if (!rawPageNumber || rawPageNumber < 1 || isNaN(rawPageNumber)) {
      return 1;
    }
    return Math.min(rawPageNumber, totalPages || 1);
  }, [rawPageNumber, totalPages]);

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    // Optional: Reset to page 1 when changing page size
    router.replace(`${pathname}?${createQueryString('page', '1')}`);
  };

  const pagesToShow = Math.min(5, totalPages);
  const startPage = Math.max(
    1,
    Math.min(
      pageNumber - Math.floor(pagesToShow / 2),
      totalPages - pagesToShow + 1
    )
  );

  return (
    <>
      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead
                className='cursor-pointer'
                onClick={() => handleSort('Address')}
              >
                <Button variant='ghost'>
                  Địa chỉ
                  {sortField === 'Address' ? (
                    sortOrder === Sort.ASC ? (
                      <SortAsc className='ml-2 size-4' />
                    ) : (
                      <SortDesc className='ml-2 size-4' />
                    )
                  ) : (
                    <ArrowUpDown className='ml-2 size-4' />
                  )}
                </Button>
              </TableHead>
              <TableHead>Tình trạng</TableHead>
              <TableHead className='text-right'>Xem chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={6} rows={pageSize} />
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='py-10 text-center'>
                  Không tìm thấy cửa hàng.{' '}
                  {isSearching && 'Hãy thử một từ khóa tìm kiếm khác.'}
                </TableCell>
              </TableRow>
            ) : (
              stores?.map((store, index) => (
                <TableRow key={store?.id}>
                  <TableCell className='text-muted-foreground'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='overflow-hidden'>
                    <p className='line-clamp-2'>{store?.address}</p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        store?.userStores.length > 0
                          ? 'border border-green-200 bg-green-100 text-green-800'
                          : 'border border-red-200 bg-red-100 text-red-800'
                      }`}
                    >
                      <span
                        className={`mr-2 h-2 w-2 rounded-full ${
                          store?.userStores.length > 0
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      ></span>
                      {store?.userStores.length > 0
                        ? 'Đang thuê'
                        : 'Đang trống'}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Link href={`${PATH.USER_STORES}/${store?.id}`}>
                      <Button variant={'outline'} size={'icon'}>
                        <Eye className='size-4' />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and page size controls */}
      {!showEmptyState && (
        <div className='mt-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='whitespace-nowrap text-sm text-muted-foreground'>
              Số dòng:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className='h-8 w-16'>
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='30'>30</SelectItem>
                <SelectItem value='40'>40</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {totalPages > 0 && (
            <Pagination className='m-0 flex items-center justify-end'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={
                      pageNumber > 1
                        ? pathname +
                          '?' +
                          createQueryString('page', (pageNumber - 1).toString())
                        : '#'
                    }
                    className={
                      pageNumber <= 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pagesToShow }).map((_, index) => {
                  const page = startPage + index;
                  if (page <= totalPages) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={
                            pathname +
                            '?' +
                            createQueryString('page', page.toString())
                          }
                          isActive={pageNumber === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href={
                      pageNumber < totalPages
                        ? pathname +
                          '?' +
                          createQueryString('page', (pageNumber + 1).toString())
                        : '#'
                    }
                    className={
                      pageNumber >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </>
  );
};

export default StoreRentTable;
