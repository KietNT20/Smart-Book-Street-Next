// hooks/use-book-operations.ts
import { useBookSearch } from '@/hooks/use-book-search';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/useDebounce';
import { BookFormValues } from '@/lib/zod';
import { BookSearchCriteria } from '@/types/book-types';
import { toast } from 'sonner';

type UseBookListProps = {
  pagination: BookTableState;
  searchCriteria: Partial<BookSearchCriteria>;
};

type UseBookMutationProps = {
  _onSuccess?: () => void;
};

type BookTableState = {
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
};

export function useBookList({ pagination, searchCriteria }: UseBookListProps) {
  const { data: bookData, isLoading } = useBookSearch({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortField: pagination.sortField,
    sortOrder: pagination.sortOrder,
    result: searchCriteria,
  });

  const isLoadingBooks = useDebounce(isLoading, 300);

  const { deleteBookMutation } = useBookMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteBookMutation.mutateAsync(id);
      toast.success('Đã xóa sách');
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa sách');
      console.error('Error deleting book:', error);
    }
  };

  return {
    bookData,
    isLoadingBooks,
    handleDelete,
    deleteBookMutation,
  };
}

// Hook for create and update book
export function useCreateBook({ _onSuccess }: UseBookMutationProps = {}) {
  const { createBookMutation } = useBookMutations();

  const handleCreate = async (data: BookFormValues) => {
    try {
      await createBookMutation.mutateAsync(data);
      _onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    handleCreate,
    isLoading: createBookMutation.isPending,
  };
}

export function useUpdateBook({ _onSuccess }: UseBookMutationProps = {}) {
  const { updateBookMutation } = useBookMutations();

  const handleUpdate = async (data: BookFormValues) => {
    try {
      await updateBookMutation.mutateAsync(data, {
        onSuccess: () => {
          toast.success('Cập nhật sách thành công');
          _onSuccess?.();
        },
        onError: () => {
          toast.error('Đã xảy ra lỗi khi cập nhật sách');
        },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    handleUpdate,
    isLoading: updateBookMutation.isPending,
  };
}
