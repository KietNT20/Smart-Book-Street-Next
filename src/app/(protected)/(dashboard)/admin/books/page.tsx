'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Sort } from '@/enums/enums';
import useDebounce from '@/hooks/use-debounce';
import { Book, BookSearchCriteria } from '@/types/book-types';
import { BookToolbar } from './_components/book-toolbar';
import { SearchBookModal } from './_components/search-book-modal';
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
      <BookToolbar
        hasFilters={hasFilters()}
        onResetFilters={resetAllFilters}
        onOpenSearch={() => setModalState({ type: 'search' })}
      />

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
