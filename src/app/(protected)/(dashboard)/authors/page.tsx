'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useGetAuthors } from '@/hooks/use-author';
import useDebounce from '@/hooks/use-debounce';
import { AuthorSearchPagination } from '@/types/author-types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

const AuthorsPage = () => {
  const [searchParams, setSearchParams] = useState<AuthorSearchPagination>({
    pageNumber: 1,
    pageSize: 10,
    sortOrder: Sort.DESC,
    sortField: '',
    result: {
      authorName: '',
    },
  });

  const { authorsRes, authorsLoading, error, totalPage } =
    useGetAuthors(searchParams);

  const debouncedResults = useDebounce(authorsRes, 300);

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

  const handleSortFieldChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      pageNumber: 1,
      sortField: value,
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
        <h2 className='text-2xl font-bold'>Quản lý Tác giả</h2>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:flex lg:items-end'>
          <div className='lg:flex-1'>
            <Label
              className='mb-2 hidden text-sm font-medium lg:block'
              htmlFor='search-author'
            >
              Tìm tác giả
            </Label>
            <Input
              placeholder='Nhập tên tác giả...'
              value={searchParams.result.authorName}
              onChange={(e) => handleAuthorNameChange(e.target.value)}
              className='w-full lg:max-w-sm'
              id='search-author'
            />
          </div>

          <div className='lg:w-48'>
            <Label className='mb-2 hidden text-sm font-medium lg:block'>
              Chọn trường sắp xếp
            </Label>
            <Select
              value={searchParams.sortField}
              onValueChange={handleSortFieldChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn trường sắp xếp' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='authorName'>Tên tác giả</SelectItem>
                <SelectItem value='dob'>Ngày sinh</SelectItem>
                <SelectItem value='nationality'>Quốc tịch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='lg:w-48'>
            <Label className='mb-2 hidden text-sm font-medium lg:block'>
              Chọn kiểu sắp xếp
            </Label>
            <Select
              value={searchParams.sortOrder.toString()}
              onValueChange={handleSortOrderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn kiểu sắp xếp' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`${Sort.ASC}`}>Tăng dần</SelectItem>
                <SelectItem value={`${Sort.DESC}`}>Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Link
            href={PATH.ADMIN_AUTHOR_CREATE}
            className='flex items-center'
            passHref
          >
            <Button className='w-full md:max-w-sm'>
              <Plus className='mr-2' /> Thêm tác giả
            </Button>
          </Link>
        </div>

        {error ? (
          <div className='py-4 text-center text-red-500'>
            Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={debouncedResults || []}
            isLoading={authorsLoading}
            pageSize={searchParams.pageSize}
            pageCount={totalPage}
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
