'use client';

import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import { BookSearchCriteria } from '@/types/book-types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import BookSearchFilter from './_components/book-search-filter';
import { useBookList } from './_lib/use-book-operations';
import { useBookPageState } from './_lib/use-book-page-state';
import { columns } from './columns';
import { DataTable } from './data-table';
import Loading from './loading';

export default function BooksPage() {
  const { pagination, setPagination, searchCriteria, setSearchCriteria } =
    useBookPageState();

  const { booksRes, isLoadingBooks, isPending } = useBookList({
    pagination,
    searchCriteria,
  });

  const handleSearch = (criteria: Partial<BookSearchCriteria>) => {
    setSearchCriteria(criteria);
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>Danh sách sách</h3>
          <Link href={PATH.BOOK_CREATE} passHref>
            <Button>
              <Plus className='mr-2' /> Thêm sách
            </Button>
          </Link>
        </div>
        <BookSearchFilter
          initialFilter={searchCriteria}
          onFilterChange={handleSearch}
        />
        <DataTable
          columns={columns}
          data={booksRes?.results || []}
          pageCount={booksRes?.totalPages}
          state={pagination}
          onStateChange={setPagination}
          isLoading={isLoadingBooks || isPending}
        />
      </div>
    </Suspense>
  );
}
