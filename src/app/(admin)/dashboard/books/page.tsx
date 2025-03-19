'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import useDebounce from '@/hooks/useDebounce';
import { Book, BookSearchCriteria } from '@/types/book-types';
import { Plus, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchBookModal } from './_components/search-book-modal';
import { useBookList } from './_lib/use-book-operations';
import { useBookPageState } from './_lib/use-book-page-state';
import { createColumns } from './columns';
import { DataTable } from './data-table';
import { Sort } from '@/enums/enums';

export default function BooksPage() {
  const {
    pagination,
    setPagination,
    searchCriteria,
    setSearchCriteria,
    modalState,
    setModalState,
    deleteId,
    setDeleteId,
    resetAllFilters
  } = useBookPageState();

  const { bookData, isLoadingBooks, handleDelete, deleteBookMutation } =
    useBookList({
      pagination,
      searchCriteria
    });

  const deletedLoading = useDebounce(deleteBookMutation.isPending, 300);

  const columns = createColumns({
    _onDelete: (id?: string) => {
      setDeleteId(id || null);
    }
  });

  const router = useRouter();

  const handleSearch = (criteria: Partial<BookSearchCriteria>) => {
    setSearchCriteria(criteria);
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  };

  const hasFilters = () =>
    Object.keys(searchCriteria).length > 0 ||
    pagination.sortField !== 'lastUpdatedDate' ||
    pagination.sortOrder !== Sort.DESC;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý sách</h2>
        <div className='flex items-center gap-2'>
          {hasFilters() && (
            <Button
              variant='outline'
              onClick={resetAllFilters}
              className='gap-2'
            >
              <X className='h-4 w-4' />
              Đặt lại bộ lọc
            </Button>
          )}
          <Button
            variant='outline'
            onClick={() => setModalState({ type: 'search' })}
          >
            <Search className='mr-2 h-4 w-4' />
            Tìm kiếm
          </Button>
          <Button onClick={() => router.push(`${PATH.BOOKS}/create`)}>
            <Plus className='mr-2 h-4 w-4' /> Thêm sách mới
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={(bookData?.results || []).filter(
          (book: Book) => !book.isDeleted === true
        )}
        pageCount={bookData?.totalPages}
        state={pagination}
        onStateChange={setPagination}
        isLoading={isLoadingBooks}
      />

      <SearchBookModal
        isOpen={modalState.type === 'search'}
        onClose={() => setModalState({ type: 'none' })}
        onSearch={handleSearch}
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
        title='Xóa sách'
        description='Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác.'
        confirmText='Xóa'
        cancelText='Hủy'
        variant='destructive'
        isLoading={deletedLoading}
      />
    </div>
  );
}
