'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBookSearch } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import { useToast } from '@/hooks/use-toast';
import { BookFormValues } from '@/lib/zod';
import { Book, BookSearchCriteria } from '@/types/book-types';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { BookForm } from './_components/book-form';
import { SearchBookModal } from './_components/search-book-modal';
import { createColumns } from './columns';
import { BookTableState, DataTable } from './data-table';

export default function BooksPage() {
  // Pagination state
  const [pagination, setPagination] = useState<BookTableState>({
    pageIndex: 1,
    pageSize: 10,
    sortField: 'createdDate',
    sortOrder: 1,
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<
    Partial<BookSearchCriteria>
  >({});

  // Dialog states
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Toast
  const { toast } = useToast();

  // Queries and mutations
  const { data, isLoading: isLoadingBooks } = useBookSearch({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortField: pagination.sortField,
    sortOrder: pagination.sortOrder,
    result: searchCriteria,
  });

  const { createBookMutation, updateBookMutation, deleteBookMutation } =
    useBookMutations();

  // Create table columns
  const columns = createColumns({
    onEdit: (book) => {
      setSelectedBook(book);
      setIsDialogOpen(true);
    },
    onDelete: (id?: string) => {
      if (id) setDeleteId(id);
    },
  });

  // Handlers
  const handleSubmit = async (data: BookFormValues) => {
    try {
      if (selectedBook) {
        await updateBookMutation.mutateAsync(data);
        toast({
          title: 'Cập nhật thành công',
          description: 'Sách đã được cập nhật',
        });
      } else {
        await createBookMutation.mutateAsync(data);
        toast({
          title: 'Thêm mới thành công',
          description: 'Sách đã được thêm vào hệ thống',
        });
      }
      setIsDialogOpen(false);
      setSelectedBook(undefined);
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể lưu thông tin sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBookMutation.mutateAsync(deleteId);
      toast({
        title: 'Xóa thành công',
        description: 'Sách đã được xóa khỏi hệ thống',
      });
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Không thể xóa sách. Vui lòng thử lại',
        variant: 'destructive',
      });
      console.error('Error deleting book:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleSearch = (criteria: Partial<BookSearchCriteria>) => {
    setSearchCriteria(criteria);
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  };

  const hasFilters = () => {
    return (
      Object.keys(searchCriteria).length > 0 ||
      pagination.sortField !== 'createdDate' ||
      pagination.sortOrder !== 1
    );
  };

  const handleResetAll = () => {
    setPagination({
      pageIndex: 1,
      pageSize: 10,
      sortField: 'createdDate',
      sortOrder: 1,
    });
    setSearchCriteria({});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quản lý sách</h2>
        <div className="flex items-center gap-2">
          {hasFilters() && (
            <Button
              variant="outline"
              onClick={handleResetAll}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Đặt lại bộ lọc
            </Button>
          )}
          <Button variant="outline" onClick={() => setIsSearchOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              setSelectedBook(undefined);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Thêm sách
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.results || []}
        pageCount={data?.totalPages}
        state={pagination}
        onStateChange={setPagination}
        isLoading={isLoadingBooks}
      />

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedBook ? 'Cập nhật sách' : 'Thêm sách mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-1">
            <BookForm
              book={selectedBook}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={
                createBookMutation.isPending || updateBookMutation.isPending
              }
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa sách"
        description="Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        isLoading={deleteBookMutation.isPending}
      />

      <SearchBookModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}
