'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import { BookSearchCriteria } from '@/types/book-types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import BookSearchFilter from './_components/book-search-filter';
import { useBookList } from './_lib/use-book-operations';
import { useBookPageState } from './_lib/use-book-page-state';
import { createColumns } from './columns';
import { DataTable } from './data-table';

export default function BooksPage() {
  const {
    pagination,
    setPagination,
    searchCriteria,
    setSearchCriteria,
    deleteId,
    setDeleteId,
  } = useBookPageState();

  const { booksRes, isLoadingBooks, handleDelete, deletedLoading, isPending } =
    useBookList({
      pagination,
      searchCriteria,
    });

  const columns = createColumns({
    _onDelete: (id?: string) => {
      setDeleteId(id || null);
    },
  });

  const handleSearch = (criteria: Partial<BookSearchCriteria>) => {
    setSearchCriteria(criteria);
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  };

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-2xl font-bold'>Danh sách sách</h3>

        <Link href={PATH.BOOK_CREATE}>
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

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId);
            setDeleteId(null);
          }
        }}
        title='Bạn có chắc chắn muốn xóa?'
        description={`Bạn có chắc chắn muốn xóa ${booksRes?.results.find((book) => book.id === deleteId)?.title || 'sách này'} không? Hành động này không thể hoàn tác.`}
        variant='destructive'
        confirmText='Xác nhận xóa'
        isLoading={deletedLoading}
      />
    </div>
  );
}
