'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PATH } from '@/enums/path';
import { useSearchPaginationAuthor } from '@/hooks/use-author';
import useDebounce from '@/hooks/useDebounce';
import { SearchPaginationAuthor } from '@/types/author-types';
import Link from 'next/link';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

const AuthorsPage = () => {
  const [searchParams, setSearchParams] = useState<SearchPaginationAuthor>({
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 0,
    sortField: '',
    result: {
      authorName: '',
    },
  });

  const {
    data: resDataAuthors,
    isLoading,
    isError,
  } = useSearchPaginationAuthor(searchParams);

  const debouncedResults = useDebounce(resDataAuthors?.results, 300);

  const handleAuthorNameChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: 1,
      result: {
        ...prev.result,
        authorName: value,
      },
    }));
  };

  const handleSortOrderChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: 1,
      sortOrder: parseInt(value),
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageNumber: 1,
    }));
  };

  return (
    <div className='container mx-auto'>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Quản lý Tác giả</h1>
          <Link href={`${PATH.AUTHORS}/create`}>
            <Button variant='default'>Thêm tác giả mới</Button>
          </Link>
        </div>

        <div className='flex items-end gap-4'>
          <div className='flex-1'>
            <label
              className='mb-2 block text-sm font-medium'
              htmlFor='search-author'
            >
              Tìm tác giả
            </label>
            <Input
              placeholder='Nhập tên tác giả...'
              value={searchParams.result.authorName}
              onChange={(e) => handleAuthorNameChange(e.target.value)}
              className='max-w-sm'
              id='search-author'
            />
          </div>

          <div className='w-48'>
            <label className='mb-2 block text-sm font-medium'>
              Sắp xếp theo ngày tạo
            </label>
            <Select
              value={searchParams.sortOrder.toString()}
              onValueChange={handleSortOrderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn kiểu sắp xếp' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>Mặc định</SelectItem>
                <SelectItem value='1'>Tăng dần</SelectItem>
                <SelectItem value='2'>Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isError ? (
          <div className='py-4 text-center text-red-500'>
            Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={debouncedResults || []}
            isLoading={isLoading}
            pageSize={searchParams.pageSize}
            pageCount={resDataAuthors?.totalPages}
            currentPage={searchParams.pageNumber}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default AuthorsPage;
