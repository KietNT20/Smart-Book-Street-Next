'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import { BookFormValues } from '@/lib/zod';
import { Book, BookSearchCriteria } from '@/types/book-types';
import { Plus, Search, X } from 'lucide-react';
import { BookDialog } from './_components/book-dialog';
import { BookForm } from './_components/book-form';
import { SearchBookModal } from './_components/search-book-modal';
import { useBookOperations } from './_lib/use-book-operations';
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
    selectedBook,
    setSelectedBook,
    deleteId,
    setDeleteId,
    resetAllFilters,
  } = useBookPageState();

  const {
    bookData,
    isLoadingBooks,
    handleSubmit: handleBookSubmit,
    handleDelete,
    createBookMutation,
    updateBookMutation,
    deleteBookMutation,
  } = useBookOperations({
    pagination,
    searchCriteria,
    onSuccess: () => {
      setModalState({ type: 'none' });
      setSelectedBook(undefined);
    },
  });

  // Create table columns
  const columns = createColumns({
    _onEdit: (book) => {
      setSelectedBook(book);
      setModalState({ type: 'form' });
    },
    _onDelete: (id?: string) => {
      setDeleteId(id || null);
    },
  });

  const handleSearch = (criteria: Partial<BookSearchCriteria>) => {
    setSearchCriteria(criteria);
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  };

  const hasFilters = () =>
    Object.keys(searchCriteria).length > 0 ||
    pagination.sortField !== 'createdDate' ||
    pagination.sortOrder !== 1;

  const handleFormSubmit = async (data: BookFormValues) => {
    await handleBookSubmit(data, selectedBook);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý sách</h2>
        <div className="flex items-center gap-2">
          {hasFilters() && (
            <Button
              variant="outline"
              onClick={resetAllFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Đặt lại bộ lọc
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setModalState({ type: 'search' })}
          >
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              setSelectedBook(undefined);
              setModalState({ type: 'form' });
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm sách
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

      <BookDialog
        isOpen={modalState.type === 'form'}
        onClose={() => setModalState({ type: 'none' })}
        title={selectedBook ? 'Cập nhật sách' : 'Thêm sách mới'}
      >
        <BookForm
          book={selectedBook}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState({ type: 'none' })}
          isLoading={
            createBookMutation.isPending || updateBookMutation.isPending
          }
        />
      </BookDialog>

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
        title="Xóa sách"
        description="Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        isLoading={deleteBookMutation.isPending}
      />
    </div>
  );
}
