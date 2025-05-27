'use client';

import TablePagination from '@/components/pagination/table-pagination';
import { TableSkeleton } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Street } from '@/types/street-types';
import { Empty } from 'antd';
import {
  ArrowUpDown,
  Eye,
  FileEdit,
  MoreHorizontal,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import Link from 'next/link';

type Props = {
  streets: Street[];
  isLoading: boolean;
  isSearching: boolean;
  totalPages: number;
  pageNumber: number;
  setPageNumber: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortField: string;
  sortOrder: Sort;
  handleSort: (field: string) => void;
};

const StreetTable = ({
  streets,
  isLoading,
  isSearching,
  totalPages,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
  sortField,
  sortOrder,
  handleSort,
}: Props) => {
  const showEmptyState = !isLoading && (!streets || streets.length === 0);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPageNumber(1);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className='ml-2 h-4 w-4' />;
    }
    return sortOrder === Sort.ASC ? (
      <SortAsc className='ml-2 h-4 w-4' />
    ) : (
      <SortDesc className='ml-2 h-4 w-4' />
    );
  };

  const getEmptyMessage = () => {
    if (isSearching) {
      return 'Không có đường sách nào được tìm thấy với từ khóa này.';
    }
    return 'Chưa có đường sách nào được tạo.';
  };

  return (
    <>
      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>STT</TableHead>
              <TableHead
                className='cursor-pointer select-none'
                onClick={() => handleSort('StreetName')}
              >
                <Button variant='ghost' className='h-8 px-2'>
                  Tên Đường Sách
                  {getSortIcon('StreetName')}
                </Button>
              </TableHead>
              <TableHead
                className='cursor-pointer select-none'
                onClick={() => handleSort('Address')}
              >
                <Button variant='ghost' className='h-8 px-2'>
                  Địa chỉ
                  {getSortIcon('Address')}
                </Button>
              </TableHead>
              <TableHead className='w-24 text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={4} rows={pageSize} />
            ) : showEmptyState ? (
              <TableRow>
                <TableCell colSpan={4} className='h-64 p-0 text-center'>
                  <div className='flex h-full w-full items-center justify-center'>
                    <Empty
                      description={getEmptyMessage()}
                      className='text-muted-foreground'
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              streets.map((street, index) => (
                <TableRow
                  key={street?.id || index}
                  className='hover:bg-muted/50'
                >
                  <TableCell className='font-mono text-sm text-muted-foreground'>
                    {index + 1 + (pageNumber - 1) * pageSize}
                  </TableCell>
                  <TableCell className='font-medium'>
                    <div
                      className='max-w-xs truncate'
                      title={street?.streetName}
                    >
                      {street?.streetName || 'Chưa cung cấp'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='max-w-sm truncate' title={street?.address}>
                      {street?.address || 'Chưa cung cấp'}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          aria-label='Mở menu thao tác'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-48'>
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem asChild className='cursor-pointer'>
                          <Link
                            href={`${PATH.STREETS}/${street?.id}`}
                            className='flex items-center'
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className='cursor-pointer'>
                          <Link
                            href={`${PATH.STREETS}/${street?.id}/edit`}
                            className='flex items-center'
                          >
                            <FileEdit className='mr-2 h-4 w-4' />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
              Hiển thị:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className='h-8 w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='30'>30</SelectItem>
                <SelectItem value='40'>40</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
            <span className='whitespace-nowrap text-sm text-muted-foreground'>
              dòng mỗi trang
            </span>
          </div>

          <TablePagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
};

export default StreetTable;
